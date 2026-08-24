import { PageStates } from "~/data/pageStates";

export function usePageEnter(cb: () => any) {
  const pageStore = usePageStore();
  watch(
    () => pageStore.pageState,
    async (state) => {
      if (state === PageStates.ENTER_START) {
        await cb();

        pageStore.send("entered");
        pageStore.send("idle");
      }
    },
  );
}

export function usePageLeave(cb: () => void) {
  const pageStore = usePageStore();
  watch(
    () => pageStore.pageState,
    (state) => state === PageStates.LEAVE_START && cb(),
  );
}
