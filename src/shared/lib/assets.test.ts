import { describe, it, expect } from "vitest";
import { getAssetPath } from "./assets";

describe("getAssetPath", () => {
  it("joins base URL and asset path without double slash", () => {
    expect(getAssetPath("assets/logo.png")).toBe("/assets/logo.png");
  });

  it("handles leading slash in asset path", () => {
    expect(getAssetPath("/assets/logo.png")).toBe("/assets/logo.png");
  });
});
