import { PageStates } from "~/data/pageStates";

type PageState = "enter:start" | "enter:end" | "leave:start" | "leave:end";

export const usePageStore = defineStore("page", () => {
  const pageState = ref<PageState>("enter:start");

  function setPageState(state: PageState) {
    pageState.value = state;
  }

  return {
    pageState,
    setPageState,
  };
});
