import GlobalSyncEvent, { GlobalSyncEventType } from "~/core/global-sync-event";
import useQuery from "~/core/use-query";
import { DefaultCache } from "~/core/default-cache";
import { DefaultCacheSync } from "~/core/default-cache-sync";

declare global {
  interface WindowEventMap {
    [GlobalSyncEventType]: GlobalSyncEvent<unknown>;
  }
}

export { GlobalSyncEvent, GlobalSyncEventType, useQuery, DefaultCache, DefaultCacheSync };

