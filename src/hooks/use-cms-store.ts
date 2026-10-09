import { useSyncExternalStore } from "react";
import { cmsStore } from "@/lib/cms-store";

export function useCmsStore() {
  const storeState = useSyncExternalStore(
    (callback) => cmsStore.subscribe(callback),
    () => cmsStore.getState(),
    () => cmsStore.getState()
  );

  return {
    ...storeState,
    store: cmsStore,
  };
}
