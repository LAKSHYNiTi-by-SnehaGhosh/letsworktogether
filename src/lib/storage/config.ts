export const STORAGE_CONFIG = {
  BUCKET_PUBLIC: process.env.R2_BUCKET_PUBLIC || 'lwt-public',
  BUCKET_PRIVATE: process.env.R2_BUCKET_PRIVATE || 'lwt-private',
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOC_TYPES: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
};

export function buildStoragePath(entityType: string, entityId: string, fileId: string, fileName: string) {
  // Sanitize fileName to prevent issues
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${entityType}/${entityId}/${fileId}-${sanitizedFileName}`;
}
