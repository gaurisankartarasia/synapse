
// // components/MobileHeader.tsx
// 'use client';

// import Link from 'next/link';
// import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
// import Image from 'next/image';

// interface MobileHeaderProps {
//   UserDropdown: React.ReactNode;
// }

// export function MobileHeader({ UserDropdown }: MobileHeaderProps) {
//   return (
//     <AppBar
//       position="fixed"
//       color="default"
//       elevation={1}
//       sx={{
//         display: { xs: 'flex', md: 'none' },
//         top: 0,
//         left: 0,
//         right: 0,
//         zIndex: 1201,
//         backdropFilter: 'blur(8px)',
//         bgcolor: 'background.paper',
//         borderBottom: '1px solid',
//         borderColor: 'divider',
//       }}
//     >
//       <Toolbar
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           minHeight: 64,
//           px: 2,
//         }}
//       >
//         <Link href="/" passHref>
//           <Box
//             component="div"
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//            <Image src="/synapse_logo.svg" alt="logo" height={32} width={32} />
//           </Box>
//         </Link>
//         {/* User dropdown */}
//         {UserDropdown}
//       </Toolbar>
//     </AppBar>
//   );
// }











// components/MobileHeader.tsx
'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Box } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles'; // Import useTheme

interface MobileHeaderProps {
  UserDropdown: React.ReactNode;
}

export function MobileHeader({ UserDropdown }: MobileHeaderProps) {
  const theme = useTheme(); // Get the current theme

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        display: { xs: 'flex', md: 'none' }, // Show only on xs screens
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure it's above the mobile drawer if you have one
        backdropFilter: 'blur(8px)',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 64, // Standard toolbar height
          px: 2,
        }}
      >
        <Link href="/" passHref>
          <Box
            component="div" // Use 'div' or 'a' if needed, but Link handles the anchor rendering
            sx={{
              display: 'flex',
              alignItems: 'center',
              // Remove gap if not needed, as Image is replacing text
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {/* Conditional Logo Rendering */}
            {theme.palette.mode === 'dark' ? (
              <Image
                src="/assets/synapse_dark.png" // Use the dark mode logo
                alt="logo"
                height={32} // Keep mobile header size
                width={32}  // Keep mobile header size
                priority // Prioritize loading the logo
              />
            ) : (
              <Image
                src="/assets/synapse_light.png" // Use the light mode logo
                alt="logo"
                height={32} // Keep mobile header size
                width={32}  // Keep mobile header size
                priority // Prioritize loading the logo
              />
            )}
          </Box>
        </Link>
        {/* User dropdown */}
        {UserDropdown}
      </Toolbar>
    </AppBar>
  );
}