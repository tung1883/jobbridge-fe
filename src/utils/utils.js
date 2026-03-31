const UPLOAD_BASE = (import.meta.env?.VITE_API_URL || "http://localhost:3000")

// get URL for file stored in BE
export function fileUrl(path) {
  if (!path) return null;

  if (path.startsWith("http")) return path;
  
  const normalized = path.replace(/\\/g, "/");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  
  return `${UPLOAD_BASE}${withSlash}`
}
