
import { ThemeOptions } from "@mui/material/styles";

export const commonThemeOptions: ThemeOptions = {

  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiTouchRipple: {
      styleOverrides: {
        root: {
          '&& .MuiTouchRipple-rippleVisible': {
            animationDuration: '200ms',
          },
        },
      },
    },
 
    MuiButton: {
      styleOverrides:  {
        root: {
          borderRadius: '50px',
          textTransform: "none",
          padding: "8px 16px",
          boxShadow: "none",
        
        },
        outlined:({theme})=>( {
          border: theme.palette.mode === "dark" ? '1px solid #ffffff8f' : '1px solid #0000008f',
          
        })
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow:'none'
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:'none'
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius:25,
        },
      },
    },

    MuiMenu:{
      styleOverrides:{
        paper:{
          borderRadius:10,
          width:200,
        }
      }
    },
    MuiMenuItem:{
      styleOverrides:{
        root:{
          paddingTop:12      ,
       paddingBottom:12   ,
     
         }
      }
    }
  },
};
