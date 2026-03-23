const UPLOAD_BASE = (import.meta.env?.VITE_API_URL || "http://localhost:3000")

/** Build full URL for BE-stored file paths like /uploads/logos/file.jpg */
export function fileUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/\\/g, "/");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${UPLOAD_BASE}${withSlash}`
}
