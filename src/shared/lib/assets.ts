import { env } from "@/shared/config/env";

export function getAssetPath(assetPath: string): string {
  const base = env.baseUrl;
  return `${base.replace(/\/$/, "")}/${assetPath.replace(/^\//, "")}`;
}
