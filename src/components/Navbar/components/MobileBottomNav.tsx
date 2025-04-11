// //components/MobileBottomNav.tsx
// 'use client';

// import { NavigationLink } from './NavigationLink';

// interface MobileBottomNavProps {
//   navLinks: any[];
//   pathname: string;
//   profileNavItem: any;
// }

// export function MobileBottomNav({
//   navLinks,
//   pathname,
//   profileNavItem,
// }: MobileBottomNavProps) {
//   return (
//     <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur grid grid-cols-5 z-50 shadow-sm">
//       {navLinks.map((item) => (
//         <NavigationLink
//           key={item.href}
//           item={item}
//           isActive={pathname === item.href}
//           isMobile
//         />
//       ))}
//       <NavigationLink
//         key={profileNavItem.href}
//         item={profileNavItem}
//         isActive={pathname === profileNavItem.href}
//         isMobile
//       />
//     </nav>
//   );
// }



// // components/MobileBottomNav.tsx
// 'use client';

// import { Box, Paper } from '@mui/material';
// import { NavigationLink } from './NavigationLink';

// interface MobileBottomNavProps {
//   navLinks: any[];
//   pathname: string;
//   profileNavItem: any;
// }

// export function MobileBottomNav({
//   navLinks,
//   pathname,
//   profileNavItem,
// }: MobileBottomNavProps) {
//   return (
//     <Paper
//       elevation={3}
//       sx={{
//         position: 'fixed',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 64,
//         borderTop: '1px solid',
//         borderColor: 'divider',
//         bgcolor: 'background.paper',
//         zIndex: 1200,
//         display: { xs: 'grid', md: 'none' },
//         gridTemplateColumns: 'repeat(5, 1fr)',
//         backdropFilter: 'blur(8px)',
//       }}
//     >
//       {navLinks.map((item) => (
//         <NavigationLink
//           key={item.href}
//           item={item}
//           isActive={pathname === item.href}
//           isMobile
//         />
//       ))}
//       <NavigationLink
//         key={profileNavItem.href}
//         item={profileNavItem}
//         isActive={pathname === profileNavItem.href}
//         isMobile
//       />
//     </Paper>
//   );
// }
// components/MobileBottomNav.tsx
'use client';

import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MobileBottomNavProps {
  navLinks: any[];
  pathname: string;
  profileNavItem: any;
}

export function MobileBottomNav({
  navLinks,
  pathname,
  profileNavItem,
}: MobileBottomNavProps) {
  const router = useRouter();
  const [value, setValue] = useState(pathname);

  useEffect(() => {
    setValue(pathname);
  }, [pathname]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    router.push(newValue);
  };

  const allLinks = [...navLinks, profileNavItem];

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: { xs: 'block', md: 'none' },
        backdropFilter: 'blur(8px)',
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        {allLinks.map((item) => (
          <BottomNavigationAction
            key={item.href}
            label={item.name}
            value={item.href}
            icon={<item.icon style={{ width: 24, height: 24 }} />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
