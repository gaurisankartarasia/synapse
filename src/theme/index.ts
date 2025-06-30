import { ThemeOptions } from "@mui/material/styles";

export const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  
  
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 30px transparent inset",
            backgroundColor: "transparent",
            transition: "background-color 5000s ease-in-out 0s",
          },
          "&:-webkit-autofill:hover": {
            WebkitBoxShadow: "0 0 0 30px transparent inset",
            backgroundColor: "transparent",
          },
          "&:-webkit-autofill:focus": {
            WebkitBoxShadow: "0 0 0 30px transparent inset",
            backgroundColor: "transparent",
          },
          "&:-webkit-autofill:active": {
            WebkitBoxShadow: "0 0 0 30px transparent inset",
            backgroundColor: "transparent",
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "8px 16px",
          boxShadow: "none",
        },
        outlined: ({ theme }) => ({
          border:
            theme.palette.mode === "dark"
              ? "1px solid #ffffff8f"
              : "1px solid #0000008f",
        }),
        contained: ({ theme }) => ({
          "&:hover": {
            boxShadow: "none",
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 25,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          width: 200,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
  },
};
