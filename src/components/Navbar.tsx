// import { useAuth } from '@/hooks/useAuth';
// import { signOut } from '../app/(auth)/signOut'
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   DropdownItem,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   Avatar,

// } from "@mui/material";
// import UploadModal from '@/app/feed/create/post/Modal';

// export default function NavbarApp() {
//   const { user } = useAuth();
//   const router = useRouter();

//   return (
//     <Navbar className='bg-white dark:bg-black'>
//       <NavbarBrand>
//         <Link href={'/'} className="font-bold text-inherit">Synapse</Link>
//       </NavbarBrand>

//       <NavbarContent className=" sm:flex gap-4" justify="center">

//         <NavbarItem >

//           <Link href="/search" className='flex items-center'>

//             <span className="material-symbols-outlined">
//               search
//             </span>
//             <span className='hidden lg:block'>Search</span>
//           </Link>
//         </NavbarItem>

//         <NavbarItem className=''>

//           <Link href="/notifications" className='flex items-center'>
//             <span className="material-symbols-outlined">
//             notifications
//             </span>
//             <span className='hidden lg:block'>notifications</span></Link>
//         </NavbarItem>

//         <NavbarItem className='hidden lg:block'>
//           <Link href="/users">users</Link>
//         </NavbarItem>
//         <NavbarItem>
       
//         </NavbarItem>
//         <UploadModal />
//       </NavbarContent>



//       <NavbarContent as="div" justify="end">
//         <Dropdown placement="bottom-end">
//           <DropdownTrigger>
//             {user && user.photoURL ? (
//               <Avatar
//                 as="button"
//                 className="transition-transform"
//                 // color="primary"
//                 name={user.displayName || "User"}
//                 size="sm"
//                 // src={user.photoURL}
//                 src={`/api/proxy?url=${encodeURIComponent(user.photoURL)}`}
//               />
//             ) : "..."}
//           </DropdownTrigger>
//           <DropdownMenu aria-label="Profile Actions" variant='flat'>
//             <DropdownItem key="profile" className="h-14 gap-2" textValue='email'>
//               <p >Signed in as</p>
//               <span className="font-semibold">{user?.email || "Guest"}</span>
//             </DropdownItem>
//             <DropdownItem
//               key="analytics"
//               onClick={() => router.push('/profile')}
//               textValue='profile'
//             >
//               <span className="material-symbols-outlined">
//                 person
//               </span>     My Profile


//             </DropdownItem>

//             <DropdownItem
//               key="settings"
//               onClick={() => router.push('/settings')}
//               textValue='settings'
//             >
//               <span className="material-symbols-outlined">
//                 settings
//               </span>     My Settings
//             </DropdownItem>
//             <DropdownItem key="logout" color="danger" onClick={signOut}
//               textValue='signout'
//             >
//               <span className="material-symbols-outlined">
//                 logout
//               </span>  Signout
//             </DropdownItem>
//           </DropdownMenu>
//         </Dropdown>
//       </NavbarContent>
//     </Navbar>
//   );
// }






import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '../app/(auth)/signOut';
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box,
  Button,
} from '@mui/material';
import { Search, Notifications, Person, Settings, Logout } from '@mui/icons-material';
// import UploadModal from '@/app/feed/create/post/Modal';

export default function NavbarApp() {
  const { user } = useAuth();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);


  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/profile');
    handleMenuClose();
  };

  const handleSettings = () => {
    router.push('/settings');
    handleMenuClose();
  };

  return (
    <AppBar position="static" color="default" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
            Synapse
          </Link>
        </Typography>

        {/* Center Items */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<Search />}
            component={Link}
            href="/search"
            sx={{ textTransform: 'none', color: 'inherit' }}
          >
            Search
          </Button>

          <Button
            startIcon={<Notifications />}
            component={Link}
            href="/notifications"
            sx={{ textTransform: 'none', color: 'inherit' }}
          >
            Notifications
          </Button>

          <Button
            component={Link}
            href="/users"
            sx={{ textTransform: 'none', color: 'inherit', display: { xs: 'none', lg: 'inline-flex' } }}
          >
            Users
          </Button>

          {/* <UploadModal /> */}
        </Box>

        {/* User Profile Dropdown */}
        <Box>
          <Tooltip title="Account settings">
            <IconButton onClick={handleMenuOpen}>
              {user?.photoURL ? (
                <Avatar
                  src={`/api/proxy?url=${encodeURIComponent(user.photoURL)}`}
                  alt={user.displayName || 'User'}
                />
              ) : (
                <Avatar>{user?.displayName?.[0] || '?'}</Avatar>
              )}
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: { minWidth: 200 },
            }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="body2">Signed in as</Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user?.email || 'Guest'}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={handleProfile}>
              <Person sx={{ marginRight: 1 }} /> My Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <Settings sx={{ marginRight: 1 }} /> My Settings
            </MenuItem>
            <MenuItem onClick={signOut}>
              <Logout sx={{ marginRight: 1 }} /> Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
