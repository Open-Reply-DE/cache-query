import { describe, it, expect } from "vitest";
import { DefaultCache } from "~/core/default-cache";

describe("defaultCache", () => {
  it("is defined", () => {
    const defaultCache = DefaultCache.createSingleton();
    expect(defaultCache).toBeDefined();
  });

  it("sets and gets data", () => {
    const defaultCache = DefaultCache.createSingleton();
    defaultCache.set(["data"], "data");
    expect(defaultCache.get(["data"])).toEqual({ data: "data", timestamp: expect.any(Number) });
  });

  it("sets and gets data with multiple keys", () => {
    const defaultCache = DefaultCache.createSingleton();
    defaultCache.set(["data", "test"], "data");
    expect(defaultCache.get(["data"])).toEqual({ data: "data", timestamp: expect.any(Number) });
  });

  it("interprets cache keys deterministically and in order", () => {
    const defaultCache = DefaultCache.createSingleton();
    defaultCache.set(["data", "test"], "data");
    expect(defaultCache.get(["test", "data"])).toBeNull();
  });


});
