export const GlobalSyncEventType = "query-cache:global-sync" as const;

export interface GlobalSyncDetail<Result> {
  id: string;
  keys: string[];
  results: Result;
}

class GlobalSyncEvent<Result> extends CustomEvent<GlobalSyncDetail<Result>> {
  constructor(detail: GlobalSyncDetail<Result>) {
    super(GlobalSyncEventType, { detail });
  }
}

export default GlobalSyncEvent;
