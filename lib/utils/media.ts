export function getMediaUrl(
  imagePath: string | null | undefined,
): string | null {
  if (!imagePath) return null;
  const normalizedPath = String(imagePath).replace(/\\/g, "/").replace(/^\//, "");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }
  return `${baseUrl}/${normalizedPath}`;
}
