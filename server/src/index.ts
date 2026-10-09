import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { finished } from "node:stream/promises";
import { basename } from "node:path";
import { CmsSnapshot, ImageAsset } from "./models.js";
import { dbRepository } from "./repositories/db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@assetify.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/assetifyhub";
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "assetifyhub";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const IMAGE_BUCKET_NAME = "image_files";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function getImageBucket() {
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB is not connected.");
  return new mongoose.mongo.GridFSBucket(database, { bucketName: IMAGE_BUCKET_NAME });
}

function imageDto(asset: {
  id?: unknown;
  _id?: unknown;
  filename: string;
  contentType: string;
  sizeBytes: number;
  altText: string;
  uploadedAt: Date;
}) {
  const id = String(asset.id || asset._id);
  return {
    id,
    filename: asset.filename,
    url: `/api/images/${id}/file`,
    fileSize: `${Math.max(1, Math.round(asset.sizeBytes / 1024))} KB`,
    format: asset.contentType,
    contentType: asset.contentType,
    sizeBytes: asset.sizeBytes,
    altText: asset.altText,
    uploadedAt: asset.uploadedAt.toISOString(),
  };
}

function hasValidImageSignature(bytes: Buffer, contentType: string) {
  switch (contentType) {
    case "image/jpeg":
      return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case "image/gif":
      return bytes.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/) !== null;
    case "image/webp":
      return bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
        bytes.subarray(8, 12).toString("ascii") === "WEBP";
    default:
      return false;
  }
}

const requireAdmin: express.RequestHandler = (req, res, next) => {
  if (!JWT_SECRET) {
    res.status(503).json({ success: false, error: "Admin API is not configured: JWT_SECRET is missing." });
    return;
  }
  const authorization = req.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  try {
    if (!token) throw new Error("Missing bearer token.");
    const claims = jwt.verify(token, JWT_SECRET);
    if (typeof claims !== "object" || claims.role !== "Super Admin" || typeof claims.email !== "string") {
      throw new Error("Invalid admin claims.");
    }
    next();
  } catch {
    res.status(401).json({ success: false, error: "Admin authentication is required." });
  }
};

// API HEALTH CHECK
app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    app: "Assetify Hub Express API Server",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    databaseName: mongoose.connection.db?.databaseName ?? null,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/cms/public", async (_req, res) => {
  try {
    const snapshot = await CmsSnapshot.findOne({ key: "site" }).lean();
    const payload = snapshot?.payload as Record<string, unknown> | undefined;
    if (!payload) {
      res.json({ success: true, data: null });
      return;
    }

    const visible = (items: unknown, predicate: (item: Record<string, unknown>) => boolean) =>
      Array.isArray(items)
        ? items.filter((item): item is Record<string, unknown> =>
            Boolean(item) && typeof item === "object" && predicate(item as Record<string, unknown>),
          )
        : [];

    res.json({
      success: true,
      data: {
        settings: payload.settings,
        siteContent: payload.siteContent,
        services: visible(payload.services, (item) => item.isVisible !== false),
        techStack: visible(payload.techStack, (item) => item.isVisible !== false),
        projects: visible(payload.projects, (item) => item.isVisible !== false),
        blogPosts: visible(
          payload.blogPosts,
          (item) => item.status === "Published" && item.isVisible !== false,
        ),
        jobs: visible(payload.jobs, (item) => item.isVisible === true),
        team: payload.team,
        sectionLayouts: payload.sectionLayouts,
        customPages: visible(payload.customPages, (item) => item.isPublished === true),
        gallery: visible(payload.gallery, (item) => item.isVisible === true),
        awards: visible(payload.awards, (item) => item.isVisible === true),
        reviews: visible(payload.reviews, (item) => item.approved === true),
        timeSlots: visible(payload.timeSlots, (item) => item.isAvailable === true),
      },
    });
  } catch (error) {
    console.error("Failed to load public CMS content", error);
    res.status(500).json({ success: false, error: "Unable to load published site content." });
  }
});

app.get("/api/cms/admin", requireAdmin, async (_req, res) => {
  try {
    const snapshot = await CmsSnapshot.findOne({ key: "site" }).lean();
    res.json({ success: true, data: snapshot?.payload ?? null });
  } catch (error) {
    console.error("Failed to load admin CMS content", error);
    res.status(500).json({ success: false, error: "Unable to load CMS content." });
  }
});

app.put("/api/cms/admin", requireAdmin, async (req, res) => {
  const payload = req.body?.payload;
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(400).json({ success: false, error: "A CMS content object is required." });
    return;
  }
  if (Buffer.byteLength(JSON.stringify(payload), "utf8") > 900 * 1024) {
    res.status(413).json({ success: false, error: "CMS content exceeds the 900 KB limit." });
    return;
  }

  try {
    await CmsSnapshot.findOneAndUpdate(
      { key: "site" },
      { $set: { payload } },
      { upsert: true, new: true, runValidators: true },
    );
    await dbRepository.logAction(ADMIN_EMAIL, "SYNC_CMS_CONTENT", "Published CMS content to MongoDB");
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to save admin CMS content", error);
    res.status(500).json({ success: false, error: "Unable to save CMS content to MongoDB." });
  }
});

// AUTHENTICATION CONTROLLER
app.get("/api/auth/session", requireAdmin, (_req, res) => {
  res.json({ success: true });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      error: "Admin API is not configured. Set JWT_SECRET and ADMIN_PASSWORD on the server.",
    });
  }
  if (email === ADMIN_EMAIL && typeof password === "string" && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email: ADMIN_EMAIL, role: "Super Admin" }, JWT_SECRET, { expiresIn: "24h" });
    await dbRepository.logAction(ADMIN_EMAIL, "LOGIN_SUCCESS", "Admin authenticated via Express API");
    return res.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        name: ADMIN_EMAIL.split("@")[0].toUpperCase(),
        role: "Super Admin"
      }
    });
  }
  return res.status(401).json({ success: false, error: "Invalid admin password" });
});

// Image metadata is stored in `images`; binary files are stored in the GridFS `image_files` bucket.
app.get("/api/images", async (_req, res) => {
  try {
    const assets = await ImageAsset.find({}).sort({ uploadedAt: -1 }).lean();
    res.json(assets.map((asset) => imageDto(asset)));
  } catch (error) {
    console.error("Failed to list image assets", error);
    res.status(500).json({ success: false, error: "Unable to load images from the database." });
  }
});

app.post(
  "/api/images",
  requireAdmin,
  express.raw({ type: ALLOWED_IMAGE_TYPES, limit: MAX_IMAGE_BYTES }),
  async (req, res) => {
    const contentType = req.header("content-type")?.split(";")[0]?.trim() ?? "";
    const bytes = req.body;
    if (!ALLOWED_IMAGE_TYPES.includes(contentType) || !Buffer.isBuffer(bytes)) {
      res.status(415).json({ success: false, error: "Upload a JPEG, PNG, WebP, or GIF image." });
      return;
    }
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
      res.status(413).json({ success: false, error: "Image files must be between 1 byte and 10 MB." });
      return;
    }
    if (!hasValidImageSignature(bytes, contentType)) {
      res.status(400).json({ success: false, error: "The uploaded file does not match its image type." });
      return;
    }

    let storageId: mongoose.Types.ObjectId | undefined;
    try {
      const decodedName = decodeURIComponent(req.header("x-file-name") || "uploaded-image");
      const filename = basename(decodedName).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 200) || "uploaded-image";
      const altText = decodeURIComponent(req.header("x-alt-text") || "").slice(0, 300);
      const upload = getImageBucket().openUploadStream(filename, {
        metadata: { contentType },
      });
      storageId = upload.id;
      upload.end(bytes);
      await finished(upload);

      const asset = await ImageAsset.create({
        filename,
        contentType,
        sizeBytes: bytes.length,
        altText,
        storageId,
      });
      await dbRepository.logAction(ADMIN_EMAIL, "UPLOAD_IMAGE", `Uploaded image: ${filename}`);
      res.status(201).json({ success: true, data: imageDto(asset) });
    } catch (error) {
      if (storageId) {
        try {
          await getImageBucket().delete(storageId);
        } catch (cleanupError) {
          console.error("Failed to clean up an unindexed GridFS image", cleanupError);
        }
      }
      console.error("Failed to upload image asset", error);
      res.status(500).json({ success: false, error: "Image upload failed. Check the server and MongoDB logs." });
    }
  },
);

app.get("/api/images/:id/file", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404).end();
    return;
  }
  try {
    const asset = await ImageAsset.findById(req.params.id).lean();
    if (!asset) {
      res.status(404).end();
      return;
    }
    res.setHeader("Content-Type", asset.contentType);
    res.setHeader("Content-Length", asset.sizeBytes);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    await finished(getImageBucket().openDownloadStream(asset.storageId).pipe(res));
  } catch (error) {
    console.error(`Failed to serve image asset ${req.params.id}`, error);
    if (!res.headersSent) res.status(500).end();
    else res.destroy(error instanceof Error ? error : undefined);
  }
});

app.patch("/api/images/:id", requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, error: "Invalid image identifier." });
    return;
  }
  const filename = typeof req.body?.filename === "string" ? basename(req.body.filename).slice(0, 200) : undefined;
  const altText = typeof req.body?.altText === "string" ? req.body.altText.slice(0, 300) : undefined;
  if (filename === undefined && altText === undefined) {
    res.status(400).json({ success: false, error: "Provide a filename or alt text to update." });
    return;
  }
  try {
    const updated = await ImageAsset.findByIdAndUpdate(
      req.params.id,
      { ...(filename !== undefined ? { filename } : {}), ...(altText !== undefined ? { altText } : {}) },
      { new: true, runValidators: true },
    );
    if (!updated) {
      res.status(404).json({ success: false, error: "Image was not found." });
      return;
    }
    await dbRepository.logAction(ADMIN_EMAIL, "UPDATE_IMAGE", `Updated image metadata: ${updated.filename}`);
    res.json({ success: true, data: imageDto(updated) });
  } catch (error) {
    console.error(`Failed to update image asset ${req.params.id}`, error);
    res.status(500).json({ success: false, error: "Unable to update image metadata." });
  }
});

app.delete("/api/images/:id", requireAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ success: false, error: "Invalid image identifier." });
    return;
  }
  try {
    const asset = await ImageAsset.findById(req.params.id);
    if (!asset) {
      res.status(404).json({ success: false, error: "Image was not found." });
      return;
    }
    await getImageBucket().delete(asset.storageId);
    await asset.deleteOne();
    await dbRepository.logAction(ADMIN_EMAIL, "DELETE_IMAGE", `Deleted image: ${asset.filename}`);
    res.json({ success: true });
  } catch (error) {
    console.error(`Failed to delete image asset ${req.params.id}`, error);
    res.status(500).json({ success: false, error: "Unable to delete image. Check the server and MongoDB logs." });
  }
});

// SITE SETTINGS CONTROLLER
app.get("/api/settings", async (_req, res) => {
  res.json(await dbRepository.getSettings());
});

app.post("/api/settings", async (req, res) => {
  const updated = await dbRepository.updateSettings(req.body);
  await dbRepository.logAction("admin@assetify.com", "UPDATE_SETTINGS", "Updated site settings via API");
  res.json({ success: true, data: updated });
});

// SERVICES CONTROLLER
app.get("/api/services", async (_req, res) => {
  res.json(await dbRepository.getServices());
});

app.post("/api/services", async (req, res) => {
  const saved = await dbRepository.saveService(req.body);
  await dbRepository.logAction("admin@assetify.com", "SAVE_SERVICE", `Saved service: ${saved.title}`);
  res.json({ success: true, data: saved });
});

app.delete("/api/services/:id", async (req, res) => {
  await dbRepository.deleteService(req.params.id);
  await dbRepository.logAction("admin@assetify.com", "DELETE_SERVICE", `Deleted service: ${req.params.id}`);
  res.json({ success: true });
});

// TECH STACK MARQUEE CONTROLLER
app.get("/api/techstack", async (_req, res) => {
  res.json(await dbRepository.getTechStack());
});

app.post("/api/techstack", async (req, res) => {
  const saved = await dbRepository.saveTechStack(req.body);
  await dbRepository.logAction("admin@assetify.com", "SAVE_TECHSTACK", `Saved tech item: ${saved.name}`);
  res.json({ success: true, data: saved });
});

app.delete("/api/techstack/:id", async (req, res) => {
  await dbRepository.deleteTechStack(req.params.id);
  await dbRepository.logAction("admin@assetify.com", "DELETE_TECHSTACK", `Deleted tech item: ${req.params.id}`);
  res.json({ success: true });
});

// PORTFOLIO & PROJECTS CONTROLLER
app.get("/api/projects", async (_req, res) => {
  res.json(await dbRepository.getProjects());
});

// BLOG ARTICLES CONTROLLER
app.get("/api/blog", async (_req, res) => {
  res.json(await dbRepository.getBlogPosts());
});

// CONSULTATION LEADS CONTROLLER
app.get("/api/leads", async (_req, res) => {
  res.json(await dbRepository.getLeads());
});

app.post("/api/leads", async (req, res) => {
  const newLead = await dbRepository.addLead(req.body);
  await dbRepository.logAction("public", "NEW_CONSULTATION_LEAD", `New consultation lead from ${newLead.name} (${newLead.email})`);
  res.status(201).json({ success: true, data: newLead });
});

app.patch("/api/leads/:id/status", async (req, res) => {
  const updated = await dbRepository.updateLeadStatus(req.params.id, req.body.status);
  await dbRepository.logAction("admin@assetify.com", "UPDATE_LEAD_STATUS", `Updated lead status to ${req.body.status}`);
  res.json({ success: true, data: updated });
});

// AUDIT LOGS CONTROLLER
app.get("/api/audit", async (_req, res) => {
  res.json(await dbRepository.getAuditLogs());
});

// CONNECT TO DB AND START SERVER
mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME }).then(async () => {
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB connected without selecting a database.");
  const imageCollection = await database.listCollections({ name: "images" }, { nameOnly: true }).hasNext();
  if (!imageCollection) await ImageAsset.createCollection();
  console.log("Connected to MongoDB.");
  app.listen(PORT, () => {
    console.log(`⚡ Assetify Hub Express API Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ Failed to connect to MongoDB", err);
});
