

// 'use client'; // <-- Required to use hooks like usePathname

// import { ButtonGroup, Button } from "@mui/material";
// import Link from "next/link";
// import { usePathname } from 'next/navigation'; // <-- Import usePathname

// export default function Navbar() {
//   const pathname = usePathname(); // <-- Get the current path

//   // Helper function to determine if a path is active
//   // You might need more complex logic if you have nested routes (e.g., /jobs/admin/settings)
//   const isActive = (href: string) => pathname === href;

//   return (
//     // You can set a default variant for the group if you like
//     // For example, variant="text" makes non-active buttons use the text style
//     <ButtonGroup variant="outlined" aria-label="navigation button group">
//       <Button
//         LinkComponent={Link}
//         href="/jobs/create_new"
//         variant={isActive('/jobs/create_new') ? 'contained' : 'outlined'}
//       >
//          Post 
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/applied"
//         variant={isActive('/jobs/applied') ? 'contained' : 'outlined'}
//       >
//          Applied
//       </Button>
//       <Button
//         LinkComponent={Link}
//         href="/jobs/posted"
//         variant={isActive('/jobs/posted') ? 'contained' : 'outlined'}
//       >
//          Posted
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/search"
//         variant={isActive('/jobs/search') ? 'contained' : 'outlined'}
//       >
//          Search
//       </Button>

//       <Button
//         LinkComponent={Link}
//         href="/jobs/profile"
//         variant={isActive('/jobs/profile') ? 'contained' : 'outlined'}
//       >
//           Profile
//       </Button>
//       <Button
//         LinkComponent={Link}
//         href="/jobs/saved"
//         variant={isActive('/jobs/saved') ? 'contained' : 'outlined'}
//       >
//          Saved
//       </Button>
//     </ButtonGroup>
//   );
// }


'use client'; // Required to use hooks like usePathname

import { ButtonGroup, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For Post (create new job)
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // For Applied
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'; // For Posted
import SearchIcon from '@mui/icons-material/Search'; // For Search
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'; // For Profile
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; 

export default function Navbar() {
  const pathname = usePathname();

  // Helper function to determine if a path is active
  const isActive = (href: string) => pathname === href;

  return (
    <ButtonGroup variant="outlined" aria-label="navigation button group" sx={{color:'red'}} >
      <Button
        LinkComponent={Link}
        href="/jobs/create_new"
        variant={isActive('/jobs/create_new') ? 'contained' : 'outlined'}
        startIcon={<AddCircleOutlineIcon />}
      >
        Post
      </Button>

      <Button
        LinkComponent={Link}
        href="/jobs/applied"
        variant={isActive('/jobs/applied') ? 'contained' : 'outlined'}
        startIcon={<AssignmentTurnedInIcon />}
      >
        Applied
      </Button>

      <Button
        LinkComponent={Link}
        href="/jobs/posted"
        variant={isActive('/jobs/posted') ? 'contained' : 'outlined'}
        startIcon={<WorkOutlineIcon />}
      >
        Posted
      </Button>

      <Button
        LinkComponent={Link}
        href="/jobs/search"
        variant={isActive('/jobs/search') ? 'contained' : 'outlined'}
        startIcon={<SearchIcon />}
      >
        Search
      </Button>

      <Button
        LinkComponent={Link}
        href="/jobs/profile"
        variant={isActive('/jobs/profile') ? 'contained' : 'outlined'}
        startIcon={<PersonOutlineIcon />}
      >
        Profile
      </Button>

      <Button
        LinkComponent={Link}
        href="/jobs/saved"
        variant={isActive('/jobs/saved') ? 'contained' : 'outlined'}
        startIcon={<BookmarkBorderIcon />}
      >
        Saved
      </Button>
    </ButtonGroup>
  );
}