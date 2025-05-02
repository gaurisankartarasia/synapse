import { ThemeOptions } from "@mui/material/styles";
import { deepmerge } from '@mui/utils'; 
import { commonThemeOptions } from ".";

// Dark theme specific options
export const darkThemeOptions: ThemeOptions = deepmerge(commonThemeOptions, {
    palette: {
      mode: 'dark',
      // Define dark mode palette colors (examples)
      primary: {
        main: '#a8c7fa', // Lighter blue for dark mode
      },
      secondary: {
        main: '#f48fb1', // Lighter pink for dark mode
      },
      background: {
        default: '#121212', // Common dark background
        paper: '#1e1e1e',   // Slightly lighter dark paper
      },
      text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
      }
      ,
      action:{
        selected: '#1f3760'
      },
      menu:{
        background: '#1e1e1e',
      }
    },
     // You can add dark-specific component overrides here if needed
    // components: {
    //   MuiAppBar: {
    //     styleOverrides: {
    //       root: {
    //         backgroundColor: '#1e1e1e',
    //       }
    //     }
    //   }
    // }
  });
  
  