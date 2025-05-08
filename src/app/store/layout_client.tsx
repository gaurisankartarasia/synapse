
// StoreLayoutClient.tsx (Client Component)
"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

// --- MUI Imports ---
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box'; // Used for layout flexibility

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import CheckroomIcon from '@mui/icons-material/Checkroom'; 
import SearchInput from "@/components/Store/SearchInput";
import { Favorite } from "@mui/icons-material";

export default function StoreLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Redux State ---
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <Box sx={{ flexGrow: 1 }}> {/* Use Box as the main container */}
      {/* --- Navigation Bar using MUI AppBar --- */}
      <AppBar position="sticky" sx={(theme) => ({ bgcolor: theme.palette.background.default, boxShadow: 'none', color: theme.palette.text.primary })}> 
        <Toolbar>
          {/* Optional: Add a title or logo here */}
          {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Store
          </Typography> */}

          {/* Spacer to push buttons to the right */}
          <Box sx={{ flexGrow: 1 }} />
          <SearchInput />

          <Box sx={{ display: 'flex', gap: 2 }}> {/* Group buttons */}
            {/* Home Link */}
            <Button
              component={Link} // Use Next.js Link for client-side routing
              href="/store"
              color="inherit" // Inherit color from AppBar
              startIcon={<HomeIcon />} // Use MUI icons
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/store/wishlist"
              color="inherit"
              startIcon={<Favorite />} // Changed icon
            >
              Wishlist
            </Button>

            {/* Orders Link */}
            <Button
              component={Link}
              href="/store/orders"
              color="inherit"
              startIcon={<CheckroomIcon />} // Changed icon
            >
              Orders
            </Button>

            <Badge badgeContent={totalItems} color="error"> {/* Position badge */}
              <Button
                component={Link}
                href="/store/cart"
                color="inherit"
                startIcon={<ShoppingCartIcon />}
              >
                Cart
              </Button>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3 }}> {/* Add padding to content */}
        {children}
      </Box>
    </Box>
  );
}