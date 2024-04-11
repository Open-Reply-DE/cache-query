import { CacheEntry } from "~/core/cache-entry";

export interface Cache {
  get: <Data>(keys: string[]) => CacheEntry<Data> | null;
  set: <Data>(keys: string[], value: Data) => void;

  invalidate(keys: string[]): void;

  addInvalidationListener(keys: string[], listener: () => void): void;
}
