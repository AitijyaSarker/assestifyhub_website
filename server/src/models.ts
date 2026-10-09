import mongoose, { Schema } from "mongoose";

// Setup global toJSON transform to map _id to id
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    const result = converted as Record<string, unknown>;
    result.id = result._id;
    delete result._id;
    delete result.__v;
  }
});

// ==========================================
// SITE SETTINGS
// ==========================================
export const SettingsSchema = new Schema({
  brandName: { type: String, required: true },
  tagline: { type: String },
  logoUrlLight: { type: String },
  logoUrlDark: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    github: { type: String },
  },
  themeDefault: { type: String, enum: ["light", "dark", "system"], default: "light" },
  analyticsId: { type: String }
});
export const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

// ==========================================
// SERVICES
// ==========================================
export const ServiceSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  pillar: { type: String, enum: ["Engineering & Design", "Brand & Digital Growth", "Infrastructure & Security"] },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String },
  icon: { type: String },
  items: [{ type: String }],
  deliverables: [{ type: String }],
  techTags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
});
export const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

// ==========================================
// TECH STACK
// ==========================================
export const TechStackSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Frontend", "Backend", "Database", "DevOps & Cloud", "Mobile", "Design & Strategy"] },
  iconSvg: { type: String },
  iconName: { type: String },
  tooltip: { type: String },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
});
export const TechStack = mongoose.models.TechStack || mongoose.model("TechStack", TechStackSchema);

// ==========================================
// PROJECTS / PORTFOLIO
// ==========================================
export const ProjectSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  summary: { type: String },
  challenge: { type: String },
  solution: { type: String },
  results: [{ type: String }],
  metrics: [{
    label: { type: String },
    value: { type: String }
  }],
  techTags: [{ type: String }],
  coverImage: { type: String },
  gallery: [{ type: String }],
  isConcept: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true }
});
export const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);

// ==========================================
// BLOG POSTS
// ==========================================
export const BlogPostSchema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String },
  content: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  author: {
    name: { type: String },
    role: { type: String },
    avatar: { type: String }
  },
  readTimeMinutes: { type: Number },
  publishedAt: { type: Date },
  status: { type: String, enum: ["Published", "Draft", "Scheduled"], default: "Draft" },
  coverImage: { type: String },
  isVisible: { type: Boolean, default: true }
});
export const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

// ==========================================
// CONSULTATION LEADS
// ==========================================
export const LeadSchema = new Schema({
  bookingDate: { type: String },
  timeSlot: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  serviceInterest: { type: String },
  budgetRange: { type: String },
  projectBrief: { type: String },
  status: {
    type: String,
    enum: ["New", "Contacted", "Confirmed", "Cancelled", "pending", "confirmed", "completed", "cancelled"],
    default: "New",
  },
  createdAt: { type: Date, default: Date.now }
});
export const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

// ==========================================
// AUDIT LOGS
// ==========================================
export const AuditLogSchema = new Schema({
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});
export const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

// Image binaries live in GridFS; this collection stores editable image metadata.
export const ImageAssetSchema = new Schema(
  {
    filename: { type: String, required: true, maxlength: 200 },
    contentType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    },
    sizeBytes: { type: Number, required: true, min: 1, max: 10 * 1024 * 1024 },
    altText: { type: String, default: "", maxlength: 300 },
    storageId: { type: Schema.Types.ObjectId, required: true, unique: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { collection: "images" },
);
ImageAssetSchema.index({ uploadedAt: -1 });
ImageAssetSchema.virtual("url").get(function () {
  return `/api/images/${this._id}/file`;
});
export const ImageAsset =
  mongoose.models.ImageAsset || mongoose.model("ImageAsset", ImageAssetSchema);

export const CmsSnapshotSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { collection: "cms_snapshots", timestamps: true },
);
export const CmsSnapshot =
  mongoose.models.CmsSnapshot || mongoose.model("CmsSnapshot", CmsSnapshotSchema);
