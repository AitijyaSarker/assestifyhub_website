export interface ImageAsset {
  id: string;
  filename: string;
  url: string;
  fileSize: string;
  format: string;
  contentType: string;
  sizeBytes: number;
  altText: string;
  uploadedAt: string;
}

async function readResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as {
    data?: T;
    error?: string;
    success?: boolean;
  };
  if (!response.ok) {
    throw new Error(body.error || `Image request failed (${response.status}).`);
  }
  return (body.data ?? body) as T;
}

export async function fetchImageAssets(): Promise<ImageAsset[]> {
  const response = await fetch("/api/images");
  return readResponse<ImageAsset[]>(response);
}

export async function uploadImageAsset(
  file: File,
  altText: string,
  token: string,
): Promise<ImageAsset> {
  const response = await fetch("/api/images", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
      "X-File-Name": encodeURIComponent(file.name),
      "X-Alt-Text": encodeURIComponent(altText),
    },
    body: file,
  });
  return readResponse<ImageAsset>(response);
}

export async function updateImageAsset(
  id: string,
  changes: Pick<ImageAsset, "filename" | "altText">,
  token: string,
): Promise<ImageAsset> {
  const response = await fetch(`/api/images/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
  return readResponse<ImageAsset>(response);
}

export async function deleteImageAsset(id: string, token: string): Promise<void> {
  const response = await fetch(`/api/images/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await readResponse<unknown>(response);
}
