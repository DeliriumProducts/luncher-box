import { future as theme } from "mdx-deck/themes";

export default {
  ...theme,
  transitionTimingFunction: "cubic-bezier(1, 0, 0, 1)",
  transitionDuration: ".8s",
  colors: {
    text: "#fafafa",
    link: "#0ff",
    background: "#623aa2"
  }
};
