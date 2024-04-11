import { Logger } from "~/core/logger";

export class CacheEntryFactory {
  private readonly logger = new Logger("CacheEntryFactory");

  public create<Data>(data: Data): CacheEntry<Data> {
    this.logger.log("creating cache entry: ", data);
    return new CacheEntry<Data>(data, new Date().getTime());
  }
}

export class CacheEntry<Data> {
  public data: Data;
  public timestamp: number;

  constructor(data: Data, timestamp: number) {
    this.data = data;
    this.timestamp = timestamp;
  }
}
