export function getParentPath(path: string, depth = 2) {
  const parts = path.split("/").filter(Boolean) // "" larni olib tashlaydi
  return "/" + parts.slice(0, depth).join("/")
}