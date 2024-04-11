import { Cache } from "~/core/cache";
import { CacheEntry, CacheEntryFactory } from "~/core/cache-entry";

/**
 * A cache that stores data in browsers local storage.
 */
export class LocalStorageCache implements Cache {
  private invalidationListeners: Record<string, (() => void)[]> = {};

  constructor(
    private readonly options = {
      cacheTime: 300000,
    },
    private readonly cacheEntryFactory: CacheEntryFactory = new CacheEntryFactory()
  ) {}

  invalidate(keys: string[]): void {
    const keyHash = this.cacheKey(keys);
    localStorage.removeItem(keyHash);
  }

  public get<Data>(keys: string[]): CacheEntry<Data> | null {
    const keyHash = this.cacheKey(keys);
    const value = localStorage.getItem(keyHash);
    if (value === null) {
      return null;
    } else {
      return JSON.parse(value) as CacheEntry<Data>;
    }
  }

  public set<Data>(keys: string[], value: Data): void {
    const keyHash = this.cacheKey(keys);
    localStorage.setItem(
      keyHash,
      JSON.stringify(this.cacheEntryFactory.create(value))
    );
    setTimeout(() => {
      localStorage.removeItem(keyHash);
    }, this.options.cacheTime);
  }

  addInvalidationListener(keys: string[], listener: () => void): void {
    const keyHash = this.cacheKey(keys);
    if (this.invalidationListeners[keyHash])
      this.invalidationListeners[keyHash].push(listener);
    else this.invalidationListeners[keyHash] = [listener];
  }

  private cacheKey(keys: string[]): string {
    return keys.join(".");
  }
}
