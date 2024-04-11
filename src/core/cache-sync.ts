export interface CacheSync {
  addListener<Result>(keys: string[], listener: (results: Result) => void): void;
  dispatch<Result>(keys: string[], results: Result): void;
}
