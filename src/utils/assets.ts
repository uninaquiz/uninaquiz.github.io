export function getAssetPath(assetPath: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`;
}
