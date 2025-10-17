import { PageStates } from "~/data/pageStates";

export function usePageEnter(cb) {
  watch(
    () => usePageStore().pageState,
    (state) => state === PageStates.ENTER_START && cb()
  );
}

export function usePageLeave(cb) {
  watch(
    () => usePageStore().pageState,
    (state) => state === PageStates.LEAVE_START && cb()
  );
}
