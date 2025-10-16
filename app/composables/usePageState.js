import { PageStates } from "~/data/pageStates";

export default function usePageEnter(cb) {
  const pageState = useState("pageState", () => "enter:start");

  watch(pageState, (state) => {
    if (state === PageStates.ENTER_START) {
      cb();
    }
  });
}

export default function usePageEnter(cb) {
  const pageState = useState("pageState", () => "enter:start");

  watch(pageState, (state) => {
    if (state === PageStates.ENTER_START) {
      cb();
    }
  });

}
