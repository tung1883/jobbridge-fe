import { API_BASE } from "../api.js";

/** Build full URL for BE-stored file paths like /uploads/logos/file.jpg */
export function fileUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const normalized = path.replace(/\\/g, "/");
  const withSlash = normalized.startsWith("/") ? normalized : `/${normalized}`;
  return `${API_BASE}${withSlash}`;
}
