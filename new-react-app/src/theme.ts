/* istanbul ignore file */
import { createMuiTheme, Color } from "@material-ui/core";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";

type CanvasBackground = {
  x: [string, string];
  y: [string, string];
};

declare module "@material-ui/core/styles" {
  interface Theme {
    canvasBackground: CanvasBackground;
    audioSettingsClosedHeight: number;
  }
  interface ThemeOptions {
    canvasBackground: CanvasBackground;
    audioSettingsClosedHeight: number;
  }
}

const primary = "#3393FA";
const white = "#FFFFFF";
const black = "#000000";
const grey: Partial<Color> = {
  50: "#EFEFF0",
  100: "#EFEFF0",
  200: "#BBBBBD",
  300: "#93989F",
  400: "#464E59",
  500: "#2B323B",
  600: "#252B32",
  700: "#20262C",
  800: "#1D2126",
  900: "#1C1E22",
};

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: primary,
      contrastText: white,
    },
    background: {
      default: grey[900],
      paper: grey[900],
    },
    divider: black,
    action: {
      active: white,
    },
    common: {
      black,
      white,
    },
    grey,
  },
  typography: {
    fontFamily: "'Open Sans', 'Helvetica', 'Arial', sans-serif",
    fontWeightBold: 700,
    fontWeightMedium: 600,
    fontWeightRegular: 400,
    fontWeightLight: 300,
  },
  canvasBackground: {
    x: ["#FC9D9A", "#F9CDAD"],
    y: ["#C8C8A9", "#83AF9B"],
  },
  audioSettingsClosedHeight: 140,
});
