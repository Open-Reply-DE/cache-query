import { describe, expect, it, vi } from "vitest";
import useQuery from "./use-query";
import waitForExpect from "~/testing/wait-for-expect";
import { Cache } from "~/core/cache";

describe("useQuery", () => {
  it("should be defined", () => {
    expect(useQuery).toBeDefined();
  });

  it("calls onsuccess if query succeeds", async () => {
    const handleSuccess = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((resolve) => {
          setTimeout(() => {
            resolve({ data: "data" });
          }, 1000);
        }),
      {
        onSuccess: handleSuccess,
      }
    );

    await waitForExpect(() => {
      expect(handleSuccess).toHaveBeenCalledOnce();
    });
  });

  it("calls onerror if the query throws", async () => {
    const handleSuccess = vi.fn();
    const handleError = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        }),
      {
        onSuccess: handleSuccess,
        onError: handleError,
      },
      {
        get: () => null,
        set: () => null,
        invalidate: () => null,
        addInvalidationListener: () => {},
      }
    );

    await waitForExpect(() => {
      expect(handleError).toHaveBeenCalledOnce();
    });

    expect(handleSuccess).not.toHaveBeenCalled();
  });

  it("sets loading state", async () => {
    const handleLoading = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 2000);
        }),
      {
        onLoading: handleLoading,
      }
    );

    expect(handleLoading).toHaveBeenCalledWith(true);

    await waitForExpect(() => {
      expect(handleLoading).toHaveBeenCalledWith(false);
    });
  });

  it("updates cache after first call", async () => {
    const handleSet = vi.fn();
    const handleGet = vi.fn();
    const handleSuccess = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((resolve) => {
          setTimeout(() => {
            resolve({ data: "some data" });
          }, 1000);
        }),
      {
        onSuccess: handleSuccess,
      },
      {
        set: handleSet,
        get: handleGet,
        invalidate: () => null,
        addInvalidationListener: () => {},
      }
    );

    expect(handleGet).toHaveBeenCalledWith(["data"]);

    await waitForExpect(() => {
      expect(handleSet).toHaveBeenCalledWith(["data"], { data: "some data" });
    });

    expect(handleSuccess).toHaveBeenCalledWith({ data: "some data" });
  });

  it("does not set fetching state for second call if cache is not stale", async () => {
    const handleLoading = vi.fn();
    const handleFetching = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        }),
      {
        onLoading: handleLoading,
        onFetching: handleFetching,
      },
      {
        set: () => 0,
        get: () => null,
        invalidate: () => null,
        addInvalidationListener: () => {},
      }
    );

    expect(handleLoading).toHaveBeenCalledWith(true);
    expect(handleFetching).toHaveBeenCalledWith(true);

    await waitForExpect(() => {
      expect(handleLoading).toHaveBeenCalledWith(false);
    });

    const handleSecondQueryLoading = vi.fn();
    const handleOnSecondQueryFetching = vi.fn();

    const cache: Cache = {
      get<Data>() {
        return {
          data: { data: "data" },
          timestamp: Date.now() + 1000,
        } as Data;
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate(): void {},
    };

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 4000);
        }),
      {
        onLoading: handleSecondQueryLoading,
        onFetching: handleOnSecondQueryFetching,
        staleTime: 50000,
      },
      cache
    );

    expect(handleSecondQueryLoading).toHaveBeenNthCalledWith(1, true);
    expect(handleSecondQueryLoading).toHaveBeenNthCalledWith(2, false);
    expect(handleOnSecondQueryFetching).not.toHaveBeenCalledWith(true);
  }, 10000);

  it("sets fetching state for second call if cache is stale", async () => {
    const handleLoading = vi.fn();
    const handleFetching = vi.fn();

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        }),
      {
        onLoading: handleLoading,
        onFetching: handleFetching,
      },
      {
        set: () => 0,
        get: () => null,
        invalidate: () => null,
        addInvalidationListener: () => {},
      }
    );

    expect(handleLoading).toHaveBeenCalledWith(true);
    expect(handleFetching).toHaveBeenCalledWith(true);

    await waitForExpect(() => {
      expect(handleLoading).toHaveBeenCalledWith(false);
    });

    const handleSecondQueryLoading = vi.fn();
    const handleOnSecondQueryFetching = vi.fn();

    const cache: Cache = {
      get<Data>() {
        return {
          data: { data: "data" },
          timestamp: Date.now() - 2000,
        } as Data;
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate(): void {},
    };

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 4000);
        }),
      {
        onLoading: handleSecondQueryLoading,
        onFetching: handleOnSecondQueryFetching,
        staleTime: 100,
      },
      cache
    );

    expect(handleSecondQueryLoading).toHaveBeenNthCalledWith(1, true);
    expect(handleSecondQueryLoading).toHaveBeenNthCalledWith(2, false);
    expect(handleOnSecondQueryFetching).toHaveBeenCalledWith(true);
  }, 10000);

  it("imperatively fetches data", async () => {
    const handleLoading = vi.fn();
    const handleFetching = vi.fn();
    let counter = 0;

    const cache: Cache = {
      get<Data>() {
        if (counter === 0) {
          counter++;
          return null;
        }

        return {
          data: { data: "data" },
          timestamp: Date.now(),
        } as Data
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate(): void {},
    };

    const { run } = useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((_, reject) => {
          setTimeout(() => {
            reject();
          }, 1000);
        }),
      {
        onLoading: handleLoading,
        onFetching: handleFetching,
      },
      cache
    );

    expect(handleLoading).toHaveBeenCalledWith(true);
    expect(handleFetching).toHaveBeenCalledWith(true);

    await waitForExpect(() => {
      expect(handleLoading).toHaveBeenCalledWith(false);
    });

    run();

    expect(handleLoading).toHaveBeenCalledWith(false);
    expect(handleFetching).toHaveBeenCalledWith(true);

    await waitForExpect(() => {
      expect(handleFetching).toHaveBeenCalledWith(false);
    });

    expect(counter).toBe(1);
  });

  it("fetches data if cache is not stale", async () => {
    const called = vi.fn();
    const handleSuccess = vi.fn();

    const timestamp = Date.now();

    const cache: Cache = {
      get<Data>() {
        return {
          data: { data: "data" },
          timestamp,
        } as Data;
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate(): void {},
    };

    useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((resolve) => {
          called();
          setTimeout(() => {
            resolve({ data: "data" });
          }, 100);
        }),
      {
        staleTime: 100000000,
        onSuccess: handleSuccess,
      },
      cache
    );

    await waitForExpect(() => {
      expect(handleSuccess).toHaveBeenCalledOnce();
    });

    expect(called).not.toHaveBeenCalledOnce();
  });

  it("fetches data if cache is stale", async () => {
    const called = vi.fn();
    const handleSuccess = vi.fn();

    const timestamp = Date.now();

    const cache: Cache = {
      get<Data>() {
        return {
          data: { data: "data" },
          timestamp,
        } as Data;
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate(): void {},
    };

    const { run } = useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((resolve) => {
          called();
          setTimeout(() => {
            resolve({ data: "data" });
          }, 100);
        }),
      {
        staleTime: 1000,
        onSuccess: handleSuccess,
      },
      cache
    );

    await waitForExpect(() => {
      expect(handleSuccess).toHaveBeenCalledOnce();
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    run();

    expect(called).toHaveBeenCalledOnce();
  });

  it("invalidates cache imperatively", async () => {
    const handleSuccess = vi.fn();
    const handleInvalidate = vi.fn();

    const timestamp = Date.now();

    const cache: Cache = {
      get<Data>() {
        return {
          data: { data: "data" },
          timestamp,
        } as Data;
      },
      set(): void {},
      addInvalidationListener(): void {},
      invalidate: handleInvalidate,
    };

    const { invalidate } = useQuery(
      ["data"],
      () =>
        new Promise<{ data: string }>((resolve) => {
          setTimeout(() => {
            resolve({ data: "data" });
          }, 100);
        }),
      {
        staleTime: 100000000,
        onSuccess: handleSuccess,
      },
      cache
    );

    await waitForExpect(() => {
      expect(handleSuccess).toHaveBeenCalledOnce();
    });

    invalidate();

    expect(handleInvalidate).toHaveBeenCalledOnce();
    expect(handleInvalidate).toHaveBeenCalledWith(["data"]);
  });
});
