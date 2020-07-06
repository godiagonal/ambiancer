/* istanbul ignore file */
import { createMuiTheme } from "@material-ui/core/styles";

type CanvasBackground = {
  x: [string, string];
  y: [string, string];
};

declare module "@material-ui/core/styles" {
  interface Theme {
    canvasBackground: CanvasBackground;
  }
  interface ThemeOptions {
    canvasBackground: CanvasBackground;
  }
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#83AF9B",
      contrastText: "#ffffff",
    },
  },
  canvasBackground: {
    x: ["#FC9D9A", "#F9CDAD"],
    y: ["#C8C8A9", "#83AF9B"],
  },
});
