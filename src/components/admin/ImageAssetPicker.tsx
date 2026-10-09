import { useEffect, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteImageAsset,
  fetchImageAssets,
  type ImageAsset,
  updateImageAsset,
  uploadImageAsset,
} from "@/lib/image-assets";

interface ImageAssetPickerProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  token: string;
  multiple?: boolean;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function ImageAssetPicker({
  label,
  value,
  onChange,
  token,
  multiple = false,
}: ImageAssetPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [altText, setAltText] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const selectedUrls = Array.isArray(value) ? value : value ? [value] : [];

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      setAssets(await fetchImageAssets());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void refresh();
  }, [open]);

  const chooseAsset = (asset: ImageAsset) => {
    if (multiple) {
      const selected = new Set(selectedUrls);
      if (selected.has(asset.url)) selected.delete(asset.url);
      else selected.add(asset.url);
      onChange([...selected]);
    } else {
      onChange(asset.url);
      setOpen(false);
    }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      setError("Image files must be between 1 byte and 10 MB.");
      return;
    }
    if (!token) {
      setError("Sign in again before uploading images.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const uploaded = await uploadImageAsset(file, altText, token);
      setAssets((current) => [uploaded, ...current]);
      if (multiple) onChange([...new Set([...selectedUrls, uploaded.url])]);
      else {
        onChange(uploaded.url);
        setOpen(false);
      }
      setAltText("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image upload failed.");
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <span className="field-label">{label}</span>
      {selectedUrls.length ? (
        <div className="flex flex-wrap gap-3">
          {selectedUrls.map((url) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt=""
                className="size-24 rounded-lg border border-border object-cover"
              />
              {multiple ? (
                <button
                  type="button"
                  aria-label="Remove selected image"
                  className="absolute -right-2 -top-2 rounded-full bg-background p-1 text-destructive shadow"
                  onClick={() => onChange(selectedUrls.filter((item) => item !== url))}
                >
                  <Trash2 className="size-4" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          No image selected
        </div>
      )}
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ImagePlus className="mr-2 size-4" />
        {multiple ? "Choose images" : "Choose image"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose from the image library</DialogTitle>
            <DialogDescription>
              Upload an image or select an existing image. Files are stored in MongoDB GridFS.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <label className="field-label">
              Accessible alt text
              <input
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                maxLength={300}
                className="form-field"
                placeholder="Describe the image"
              />
            </label>
            <div className="flex items-end">
              <input
                ref={fileInput}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                className="sr-only"
                onChange={(event) => void upload(event.target.files?.[0])}
              />
              <Button type="button" disabled={busy} onClick={() => fileInput.current?.click()}>
                {busy ? (
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 size-4" />
                )}
                Upload image
              </Button>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading image library…</p>
          ) : assets.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {assets.map((asset) => {
                const selected = selectedUrls.includes(asset.url);
                return (
                  <button
                    key={asset.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => chooseAsset(asset)}
                    className={`overflow-hidden rounded-lg border text-left ${selected ? "border-primary ring-2 ring-primary" : "border-border"}`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.altText}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                    <span className="block truncate p-2 text-xs">{asset.filename}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No images uploaded yet.
            </p>
          )}
          {multiple ? (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ImageAssetManagerProps {
  token: string;
  canDeleteImage: (url: string) => boolean;
}

export function ImageAssetManager({ token, canDeleteImage }: ImageAssetManagerProps) {
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [filenameDrafts, setFilenameDrafts] = useState<Record<string, string>>({});
  const [altTextDrafts, setAltTextDrafts] = useState<Record<string, string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const images = await fetchImageAssets();
      setAssets(images);
      setFilenameDrafts(Object.fromEntries(images.map((asset) => [asset.id, asset.filename])));
      setAltTextDrafts(Object.fromEntries(images.map((asset) => [asset.id, asset.altText])));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
      setError("Image files must be between 1 byte and 10 MB.");
      return;
    }
    setBusyId("upload");
    setError("");
    try {
      const image = await uploadImageAsset(file, "", token);
      setAssets((current) => [image, ...current]);
      setFilenameDrafts((current) => ({ ...current, [image.id]: image.filename }));
      setAltTextDrafts((current) => ({ ...current, [image.id]: image.altText }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image upload failed.");
    } finally {
      setBusyId("");
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const saveAltText = async (asset: ImageAsset) => {
    setBusyId(asset.id);
    setError("");
    try {
      const updated = await updateImageAsset(
        asset.id,
        {
          filename: filenameDrafts[asset.id] ?? asset.filename,
          altText: altTextDrafts[asset.id] ?? "",
        },
        token,
      );
      setAssets((current) => current.map((item) => (item.id === asset.id ? updated : item)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save image details.");
    } finally {
      setBusyId("");
    }
  };

  const remove = async (asset: ImageAsset) => {
    if (!canDeleteImage(asset.url)) {
      setError(
        "This image is used by published content. Remove it from that content before deleting it.",
      );
      return;
    }
    if (!window.confirm(`Delete ${asset.filename}? This permanently removes the stored image.`))
      return;
    setBusyId(asset.id);
    setError("");
    try {
      await deleteImageAsset(asset.id, token);
      setAssets((current) => current.filter((item) => item.id !== asset.id));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete image.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Image Library</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload, edit alt text, and remove image files stored in MongoDB.
          </p>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          className="sr-only"
          onChange={(event) => void upload(event.target.files?.[0])}
        />
        <Button
          type="button"
          disabled={busyId === "upload"}
          onClick={() => fileInput.current?.click()}
        >
          {busyId === "upload" ? (
            <LoaderCircle className="mr-2 size-4 animate-spin" />
          ) : (
            <Upload className="mr-2 size-4" />
          )}
          Upload image
        </Button>
      </header>
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      {loading ? (
        <p className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
          Loading images from the database…
        </p>
      ) : assets.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const referenced = !canDeleteImage(asset.url);
            return (
              <article
                key={asset.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <img
                  src={asset.url}
                  alt={asset.altText}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-3 p-4">
                  <div className="text-xs text-muted-foreground">{asset.fileSize}</div>
                  <label className="field-label">
                    Filename
                    <input
                      value={filenameDrafts[asset.id] ?? asset.filename}
                      maxLength={200}
                      onChange={(event) =>
                        setFilenameDrafts((current) => ({
                          ...current,
                          [asset.id]: event.target.value,
                        }))
                      }
                      className="form-field"
                    />
                  </label>
                  <label className="field-label">
                    Alt text
                    <input
                      value={altTextDrafts[asset.id] ?? ""}
                      maxLength={300}
                      onChange={(event) =>
                        setAltTextDrafts((current) => ({
                          ...current,
                          [asset.id]: event.target.value,
                        }))
                      }
                      className="form-field"
                    />
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={busyId === asset.id}
                      onClick={() => void saveAltText(asset)}
                    >
                      Save details
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={busyId === asset.id || referenced}
                      title={
                        referenced
                          ? "Remove this image from content before deleting it."
                          : "Delete image"
                      }
                      onClick={() => void remove(asset)}
                    >
                      <Trash2 className="mr-1.5 size-4" /> Delete
                    </Button>
                  </div>
                  {referenced ? (
                    <p className="text-xs text-muted-foreground">Currently used by site content.</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No images have been uploaded yet.
        </p>
      )}
    </section>
  );
}
