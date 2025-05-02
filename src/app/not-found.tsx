"use client";
import { Box, Typography,  Container } from "@mui/material";
import Image from "next/image";

export default function NotFoundPage() {

  return (
    <Container sx={{ textAlign: "center", py: 10 }}>
      <Box>
        <Image
            
          src="/assets/not-found.svg"
          alt="Page Not Found"
          width={300}
          height={300}
          style={{ margin: "0 auto", display: "block" }}
        />

        <Typography variant="h6" >
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
       
      </Box>
    </Container>
  );
}
