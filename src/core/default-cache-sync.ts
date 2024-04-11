import { CacheSync } from "~/core/cache-sync";
import GlobalSyncEvent, { GlobalSyncEventType } from "~/core/global-sync-event";
import { Logger } from "~/core/logger";
import { KeyHash } from "~/core/key-hash";
import { DefaultKeyHash } from "~/core/default-key-hash";

let instance: CacheSync | null = null;
export class DefaultCacheSync implements CacheSync {
  private uniqueId: string | null = null;

  constructor(
    debug: boolean | string = false,
    private readonly logger = new Logger(
      `DefaultCache ${debug ?? " "}`,
      !!debug
    ),
    private readonly keyHash: KeyHash = new DefaultKeyHash()
  ) {}
  public addListener<Result>(
    keys: string[],
    listener: (results: Result) => void
  ) {
    this.uniqueId = this.uuidv4();
    window.addEventListener(GlobalSyncEventType, (event) => {
      const detail = event.detail;
      this.logger.log("received global sync event", detail);
      if (detail.id === this.uniqueId) return;
      if (this.keyHash.hash(detail.keys) === this.keyHash.hash(keys)) {
        const data = detail.results as Result;
        listener(data);
      }
    });
  }

  public dispatch<Result>(keys: string[], results: Result) {
    if (!this.uniqueId) throw new Error("uniqueId is null");

    const event = new GlobalSyncEvent({
      id: this.uniqueId,
      keys,
      results,
    });

    this.logger.log("dispatching global sync event", event);

    window.dispatchEvent(event);
  }

  private uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  static createSingleton(debug: boolean | string = false) {
    const logger = new Logger(`DefaultCacheSync ${debug ?? ""}`, !!debug);
    logger.log(
      "[query cache]: using default cache sync which synchronizes locally scoped caches",
      true
    );
    if (!instance) {
      instance = new DefaultCacheSync(!!debug, logger);
    }
    return instance;
  }
}
