import { PageStates } from "~/data/pageStates";

type PageState = (typeof PageStates)[keyof typeof PageStates];

export const usePageStore = defineStore("page", () => {
  const pageState = ref<PageState>(PageStates.LEAVE_END);

  function setPageState(state: PageState) {
    pageState.value = state;
  }

  return {
    pageState,
    setPageState,
  };
});
