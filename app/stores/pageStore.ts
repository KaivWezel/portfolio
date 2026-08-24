const PageStates = {
  IDLE: "idle",
  LEAVE_START: "leave:start",
  LEAVE_END: "leave:end",
  ENTER_START: "enter:start",
  ENTER_END: "enter:end",
} as const;

type PageState = (typeof PageStates)[keyof typeof PageStates];

const transitions: Record<PageState, Partial<Record<string, PageState>>> = {
  [PageStates.IDLE]: { navigate: PageStates.LEAVE_START, entering: PageStates.ENTER_START },
  [PageStates.LEAVE_START]: { left: PageStates.LEAVE_END },
  [PageStates.LEAVE_END]: { entering: PageStates.ENTER_START },
  [PageStates.ENTER_START]: { entered: PageStates.ENTER_END },
  [PageStates.ENTER_END]: { idle: PageStates.IDLE },
};

export const usePageStore = defineStore("page", () => {
  const pageState = ref<PageState>(PageStates.IDLE);

  function send(event: string): PageState {
    const nextState = transitions[pageState.value]?.[event];
    console.log("🚀 ~ send ~ nextState:", nextState);

    if (!nextState) {
      console.warn(
        `[PageStateMachine] Invalid event "${event}" in state "${pageState.value}". ` +
          `Allowed: ${Object.keys(transitions[pageState.value] ?? {}).join(", ") || "none"}`,
      );
      return pageState.value;
    }

    pageState.value = nextState;
    return nextState;
  }
  return {
    pageState,
    send,
  };
});
