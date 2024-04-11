import { Cache } from "~/core/cache";
import { CacheSync } from "~/core/cache-sync";
import { Logger } from "~/core/logger";
import { DefaultCache } from "~/core/default-cache";
import { DefaultCacheSync } from "~/core/default-cache-sync";
import { KeyHash } from "~/core/key-hash";
import { DefaultKeyHash } from "~/core/default-key-hash";

export default <Result, Variables = void, Error = void>(
  keys: string[],
  query: (variables: Variables) => Promise<Result>,
  options: {
    onSuccess?: (result: Result) => Promise<void>;
    onError?: (error: Error) => Promise<void>;
    onLoading?: (loading: boolean) => Promise<void>;
    onIdle?: (idle: boolean) => Promise<void>;
    onSettled?: (settled: boolean) => Promise<void>;
    onFetching?: (fetching: boolean) => Promise<void>;
    staleTime?: number;
    variables?: Variables;
    debug?: boolean | string;
    defer?: boolean;
    scope?: "global" | "local";
    refetchOnWindowFocus?: boolean;
  },
  cache: Cache = DefaultCache.createSingleton(),
  cacheSync: CacheSync = DefaultCacheSync.createSingleton(options.debug),
  keyHash: KeyHash = new DefaultKeyHash()
) => {
  const logger = new Logger(`useQuery: ${keyHash.hash(keys)}: ${options.debug ?? ''}`, !!options?.debug);

  if (options?.scope === "global")
    cacheSync.addListener<Result>(keys, (result) => {
      cache.set?.(keys, result);
      options?.onSuccess?.(result);
    });

  const call = () => {
    options?.onFetching?.(true);

    query(options?.variables ?? ({} as Variables))
      .then((results) => {
        cache.set(keys, results);
        options?.onSuccess?.(results);
        if (options?.scope === "global") cacheSync?.dispatch(keys, results);
        logger.log("fetched data: ", results);
      })
      .catch((error) => {
        logger.log("error fetching data: ", error);
        options?.onError?.(error);
      })
      .finally(() => {
        options?.onSettled?.(true);
        options?.onLoading?.(false);
        options?.onFetching?.(false);
      });
  };

  const run = () => {
    options?.onSettled?.(false);
    options?.onLoading?.(true);

    const cacheEntry = cache.get<Result>(keys);

    if (cacheEntry) {
      options?.onLoading?.(false);
      options?.onSuccess?.(cacheEntry.data);
      logger.log(
        "hit cache: ",
        cacheEntry.data,
        " timestamp: ",
        cacheEntry.timestamp
      );
      if (Date.now() - cacheEntry.timestamp > (options?.staleTime ?? 0)) {
        logger.log("cache stale, updating: ", cacheEntry.data);
        call();
      }
    } else {
      logger.log("missed cache, fetching...");
      call();
    }
  };

  const invalidate = () => {
    cache.invalidate(keys);
  };

  cache.addInvalidationListener(keys, () => {
    logger.log("running query, since cache was invalidated: ", keys);
    run();
  });

  if (!options?.defer) {
    run();
  }

  if (options?.refetchOnWindowFocus) {
    window.addEventListener("focus", () => {
      run();
    });
  }

  return {
    run,
    invalidate,
  };
};
