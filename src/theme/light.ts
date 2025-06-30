// Light theme specific options

import { ThemeOptions } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { commonThemeOptions } from ".";

export const lightThemeOptions: ThemeOptions = deepmerge(commonThemeOptions, {
  palette: {
    mode: "light",
    // Define light mode palette colors (examples)
    primary: {
      main: "#005ccb", // Example blue
    },
    secondary: {
      main: "#dc004e", // Example pink
    },
    background: {
      default: "#ffffff",
      paper: "#f0f4f9",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.6)",
    },
    action: {
      selected: "#d3e3fd",
    },
    menu: {
      background: "#efedf0",
    },
  },
  // You can add light-specific component overrides here if needed
  // components: {
  //   MuiAppBar: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: '#1976d2',
  //       }
  //     }
  //   }
  // }
});
