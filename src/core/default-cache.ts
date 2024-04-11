import { Cache } from "~/core/cache";
import { Logger } from "~/core/logger";
import { CacheEntry, CacheEntryFactory } from "~/core/cache-entry";
import { KeyHash } from "~/core/key-hash";
import { DefaultKeyHash } from "~/core/default-key-hash";

let cache: DefaultCache;

/**
 * A cache that stores data in a local js object.
 */
export class DefaultCache implements Cache {
  private data: Record<string, CacheEntry<unknown>> = {};
  private invalidationListeners: Record<string, (() => void)[]> = {};

  constructor(
    debug: boolean | string = false,
    private readonly logger = new Logger(`DefaultCache ${debug ?? ' '}`, !!debug),
    private readonly options = {
      cacheTime: 300000,
    },
    private readonly cacheEntryFactory: CacheEntryFactory = new CacheEntryFactory(),
    private readonly keyHash: KeyHash = new DefaultKeyHash()
  ) {}

  public get<Data>(keys: string[]): CacheEntry<Data> | null {
    this.logger.log("getting cache entry: ", keys);
    const key = this.keyHash.hash(keys);
    return (this.data[key] as CacheEntry<Data>) ?? null;
  }

  public set<Data>(keys: string[], value: Data): void {
    this.logger.log("setting cache entry: ", keys);
    const key = this.keyHash.hash(keys);
    this.data[key] = this.cacheEntryFactory.create(value);

    setTimeout(() => {
      delete this.data[key];
    }, this.options.cacheTime);
  }

  invalidate(keys: string[]): void {
    this.logger.log("invalidating cache entry: ", keys);
    const key = this.keyHash.hash(keys);
    delete this.data[key];
    this.invalidationListeners[key]?.forEach(listener => listener());
  }

  addInvalidationListener(keys: string[], listener: () => void): void {
    const key = this.keyHash.hash(keys);
    if (this.invalidationListeners[key])
      this.invalidationListeners[key].push(listener);
    else this.invalidationListeners[key] = [listener];
  }

  static createSingleton(debug: boolean | string = false) {
    const logger = new Logger(`DefaultCacheInstance ${debug ?? ""}`, !!debug);
    logger.log(
      "[query cache]: using default cache which is locally scoped to this module"
    );
    if (!cache) {
      logger.log(
        "[query cache]: no global cache instance found, creating a new one"
      );
      cache = new DefaultCache(!!debug, logger);
    }
    return cache;
  }
}
