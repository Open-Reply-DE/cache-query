import GlobalSyncEvent, { GlobalSyncEventType } from "~/core/global-sync-event";

declare global {
  interface WindowEventMap {
    [GlobalSyncEventType]: GlobalSyncEvent<unknown>;
  }
}

