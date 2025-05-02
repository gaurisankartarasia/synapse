
// 'use client'; // Required to use hooks like usePathname

// import { ButtonGroup, Button } from "@mui/material";
// import Link from "next/link";
// import { usePathname } from 'next/navigation';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For Post (create new job)
// import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // For Applied
// import WorkOutlineIcon from '@mui/icons-material/WorkOutline'; // For Posted
// import SearchIcon from '@mui/icons-material/Search'; // For Search
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // For Profile
// import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; 
// import { Home } from "@mui/icons-material";

// export default function Navbar() {
//   const pathname = usePathname();

//   // Helper function to determine if a path is active
//   const isActive = (href: string) => pathname === href;

// const style = {
//   backgroundColor: isActive('/jobs') ? '#0b57d039' : 'transparent', 
//   color: isActive('/jobs') ? '#0b57d0' : 'inherit', 
// }

//   return (
//     <ButtonGroup variant="outlined" aria-label="navigation button group"  >
      
//       <Button
//         LinkComponent={Link}
//         href="/jobs"
//         variant={isActive('/jobs') ? 'contained' : 'outlined'}
//         startIcon={<Home />}
//        sx={style}
//       >
//         Home
//       </Button>
//       <Button
//         LinkComponent={Link}
//         href="/jobs/create_new"
//         variant={isActive('/jobs/create_new') ? 'contained' : 'outlined'}
//         startIcon={<AddCircleOutlineIcon />}
//         sx={style}
//       >
//         Post
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/applied"
//         variant={isActive('/jobs/applied') ? 'contained' : 'outlined'}
//         startIcon={<AssignmentTurnedInIcon />}
//         sx={style}
//       >
//         Applied
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/posted"
//         variant={isActive('/jobs/posted') ? 'contained' : 'outlined'}
//         startIcon={<WorkOutlineIcon />}
//         sx={style}
//       >
//         Posted
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/search"
//         variant={isActive('/jobs/search') ? 'contained' : 'outlined'}
//         startIcon={<SearchIcon />}
//         sx={style}
//       >
//         Search
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/profile"
//         variant={isActive('/jobs/profile') ? 'contained' : 'outlined'}
//         startIcon={<PersonOutlineIcon />}
//         sx={style}
//       >
//         Profile
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/saved"
//         variant={isActive('/jobs/saved') ? 'contained' : 'outlined'}
//         startIcon={<BookmarkBorderIcon />}
//         sx={style}
//       >
//         Saved
//       </Button>
//     </ButtonGroup>
//   );
// }


'use client';

import { ButtonGroup, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Home } from "@mui/icons-material";

export default function Navbar() {
  const pathname = usePathname();

  // Helper function remains the same
  const isActive = (href: string) => pathname === href;

  // Define navigation items in an array for easier mapping (DRY principle)
  const navItems = [
    { href: '/jobs', label: 'Home', icon: <Home /> }, { href: '/jobs/search', label: 'Search', icon: <SearchIcon /> },
    { href: '/jobs/create_new', label: 'Post', icon: <AddCircleOutlineIcon /> },
    { href: '/jobs/applied', label: 'Applied', icon: <AssignmentTurnedInIcon /> },
    { href: '/jobs/posted', label: 'Posted', icon: <WorkOutlineIcon /> },
   
    { href: '/jobs/profile', label: 'Profile', icon: <PersonOutlineIcon /> },
    { href: '/jobs/saved', label: 'Saved', icon: <BookmarkBorderIcon /> },
  ];

  return (
    <ButtonGroup variant="outlined" aria-label="navigation button group">
      {navItems.map((item) => (
        <Button
          key={item.href} // Add a unique key when mapping
          LinkComponent={Link}
          href={item.href}
          // Use the isActive function for *this specific item's* href
          variant={isActive(item.href) ? 'contained' : 'outlined'}
          startIcon={item.icon}
          // Remove the sx prop, let the variant handle the styling
        >
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}