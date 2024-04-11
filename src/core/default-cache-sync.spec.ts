import { describe, it, expect, vi } from "vitest";
import { DefaultCacheSync } from "~/core/default-cache-sync";

describe("defaultGlobalSync", () => {
  it("should be defined", () => {
    const defaultGlobalSync = new DefaultCacheSync();

    expect(defaultGlobalSync).toBeDefined();
  });

  it("dispatches event but does not call listener on same instance", () => {
    const listener = vi.fn();
    const defaultGlobalSync = new DefaultCacheSync();

    defaultGlobalSync.addListener(["key"], listener);

    defaultGlobalSync.dispatch(["key"], "results");

    expect(listener).not.toHaveBeenCalled();
  });

  it("dispatches event and calls listener on other instances", () => {
    const listener = vi.fn();
    const defaultGlobalSync1 = new DefaultCacheSync();
    const defaultGlobalSync2 = new DefaultCacheSync();

    defaultGlobalSync1.addListener(["key"], listener);
    defaultGlobalSync2.addListener(["key"], listener);

    defaultGlobalSync1.dispatch(["key"], "results");

    expect(listener).toHaveBeenCalledOnce();
  });

  it("dispatches event and does not call listener on other instances with different keys", () => {
    const listener = vi.fn();
    const defaultGlobalSync1 = new DefaultCacheSync();
    const defaultGlobalSync2 = new DefaultCacheSync();

    defaultGlobalSync1.addListener(["key"], listener);
    defaultGlobalSync2.addListener(["key"], listener);

    defaultGlobalSync1.dispatch(["key", "key2"], "results");

    expect(listener).not.toHaveBeenCalled();
  });
});
