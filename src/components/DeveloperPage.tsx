// pages/developers.tsx
import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import DeveloperCard from "@/components/DeveloperCard";

const developers = [
  {
    name: "Alice Johnson",
    image: "/default.webp",
    bio: "Full Stack Developer specializing in React and Node.js.",
  },
  {
    name: "Bob Smith",
    image: "/default.webp",
    bio: "Backend Developer with expertise in Python and Django.",
  },
  {
    name: "Carol Lee",
    image: "/default.webp",
    bio: "UI/UX Designer passionate about creating intuitive experiences.",
  },
];

const DevelopersPage: React.FC = () => {
  return (
    <Box
      sx={{
        padding: 4,
        textAlign: "center",
        background: "#f9f9f9",
        minHeight: "60vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Meet Our Developers
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {developers.map((developer) => (
          <Grid item xs={12} sm={6} md={4} key={developer.name}>
            <DeveloperCard
              name={developer.name}
              image={developer.image}
              bio={developer.bio}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DevelopersPage;
