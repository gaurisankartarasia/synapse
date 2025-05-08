// // src/components/Store/ProductCard.tsx
// "use client";

// import { Card, CardContent, IconButton, CardActionArea, Button } from "@mui/material";
// import { FavoriteBorder, Favorite } from "@mui/icons-material";
// import Image from "next/image";
// import Link from "next/link";
// import type { Product } from "@/types/store/types";
// import { handleAddToWishlist } from "@/hooks/store/useWishlist";
// import { useState } from "react";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {


// const [isInWishlist, setIsInWishlist] = useState(product.isWishlisted??false);

// const handleWishlistClick = () => {
//     handleAddToWishlist(product);
//     setIsInWishlist(!isInWishlist);
// };

//   return (
//     <Card sx={{ width: 280, borderRadius: 7, "&:hover": { boxShadow: 2 } }}>
//       <IconButton onClick={handleWishlistClick} className="float-end absolute z-50 right-2 top-2">
//         {product.isWishlisted? <Favorite color="error" /> :  <FavoriteBorder /> } 
//       </IconButton>
//       <CardActionArea component={Link} href={`/store/products/${product.id}`}>
//         <CardContent>
//           <div className="relative w-full h-40 sm:h-40">
//             <Image
//               src={product.imageUrl}
//               alt={product.name ?? "Product image"}
//               fill
//               sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//               priority
//               className="object-contain"
//             />
//           </div>
//           <div className="flex flex-col flex-grow px-2 py-1">
//             <h3 className="text-md font-medium mb-1 truncate" title={product.name}>
//               {product.name}
//             </h3>
//             <div className="mt-auto">
//               <p className="text-md font-medium mb-3">₹{product.price.toFixed(2)}</p>
//             </div>
//           </div>
//         </CardContent>
//       </CardActionArea>
//     </Card>
//   );
// }


// src/components/Store/catalog/ProductCard.tsx
"use client";

import { Card, CardContent, IconButton, CardActionArea } from "@mui/material";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import  { Product } from "@/types/store/types";
import { handleAddToWishlist } from "@/hooks/store/useWishlist";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(product.isWishlisted ?? false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleWishlistClick = async () => {
    setIsLoading(true); // Disable button during request
    try {
      await handleAddToWishlist(product);
      setIsInWishlist(!isInWishlist); // Update state only on success
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      // Optionally show an error message to the user (e.g., using a toast)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ width: 280, borderRadius: 7, "&:hover": { boxShadow: 2 } }}>
      <IconButton
        onClick={handleWishlistClick}
        disabled={isLoading} // Disable button while loading
        className="float-end absolute z-50 right-2 top-2"
      >
        {isInWishlist ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>
        <CardContent  component={Link} href={`/store/products/${product.id}`}>
          <div className="relative w-full h-40 sm:h-40">
            <Image
              src={product.imageUrl}
              alt={product.name ?? "Product image"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col flex-grow px-3 py-2">
            <h3 className="text-md font-medium mb-1 truncate" title={product.name}>
              {product.name}
            </h3>
            <div className="mt-auto">
              <p className="text-md font-medium mb-3">₹{product.price.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
    </Card>
  );
}