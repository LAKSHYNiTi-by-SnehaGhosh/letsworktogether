import "server-only";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export async function validateFile(file: File) {
  if (!(file instanceof File)) {
    throw new Error("Invalid file upload.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("File type not allowed.");
  }

  // To do strict validation, we would read magic bytes here.
  // const buffer = await file.arrayBuffer();
  // const arr = new Uint8Array(buffer).subarray(0, 4);
  // ... check magic byte signatures against mime type

  return true;
}
