import { del, put } from "@vercel/blob";

// Dedicated public Blob store for uploaded movie thumbnails, separate from
// the private store used for the JSON "database" files. Two stores need
// two distinct tokens.
const token = process.env.IMAGES_BLOB_READ_WRITE_TOKEN;

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

type UploadResult = { url: string } | { error: string };

export async function saveUploadedImage(file: File): Promise<UploadResult> {
  if (file.size <= 0) {
    return { error: "빈 파일은 업로드할 수 없어요." };
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return { error: "파일 크기는 5MB 미만이어야 해요." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "이미지 파일(JPG, PNG, WEBP, GIF)만 업로드할 수 있어요." };
  }

  const ext = EXT_BY_TYPE[file.type] ?? "jpg";
  const blob = await put(`movies/poster.${ext}`, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
    token,
  });

  return { url: blob.url };
}

export async function deleteUploadedImage(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url, { token });
  } catch {
    // best-effort cleanup; ignore if it's already gone
  }
}
