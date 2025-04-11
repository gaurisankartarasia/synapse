//  // components/ThemeMenu.tsx

// import React from 'react';
// import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
// import { Brightness4, Brightness7, Computer } from '@mui/icons-material';

// interface ThemeMenuProps {
//   theme: string | undefined;
//   setTheme: (theme: string) => void;
//   onClose: () => void;
// }

// export const ThemeMenu = ({ theme, setTheme, onClose }: ThemeMenuProps) => {
//   const handleThemeChange = (newTheme: string) => {
//     setTheme(newTheme);
//     onClose();
//   };

//   return (
//     <>
//       <MenuItem onClick={() => handleThemeChange('light')}>
//         <ListItemIcon>
//           <Brightness7 fontSize="small" />
//         </ListItemIcon>
//         <ListItemText primary="Light Mode" />
//       </MenuItem>
//       <MenuItem onClick={() => handleThemeChange('dark')}>
//         <ListItemIcon>
//           <Brightness4 fontSize="small" />
//         </ListItemIcon>
//         <ListItemText primary="Dark Mode" />
//       </MenuItem>
//       <MenuItem onClick={() => handleThemeChange('system')}>
//         <ListItemIcon>
//           <Computer fontSize="small" />
//         </ListItemIcon>
//         <ListItemText primary="System Theme" />
//       </MenuItem>
//     </>
//   );
// };


// components/ThemeMenu.tsx

import React, { useState } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Brightness4, Brightness7, Computer, ColorLens } from '@mui/icons-material';

interface ThemeMenuProps {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  onClose: () => void;
}

export const ThemeMenu = ({ theme, setTheme, onClose }: ThemeMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenSubmenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSubmenu = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    onClose(); // Close main menu
    handleCloseSubmenu(); // Close submenu
  };

  return (
    <>
      <MenuItem onClick={handleOpenSubmenu}>
        <ListItemIcon>
          <ColorLens fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Theme" />
      </MenuItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseSubmenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleThemeChange('light')}>
          <ListItemIcon>
            <Brightness7 fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Light Mode" />
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>
          <ListItemIcon>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dark Mode" />
        </MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')}>
          <ListItemIcon>
            <Computer fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="System Theme" />
        </MenuItem>
      </Menu>
    </>
  );
};
