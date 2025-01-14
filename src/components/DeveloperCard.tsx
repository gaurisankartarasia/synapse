// components/DeveloperCard.tsx
import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

interface DeveloperCardProps {
  name: string;
  image: string;
  bio: string;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ name, image, bio }) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        borderRadius: 3,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <CardMedia
        component="img"
        height="50"
        image={image}
        alt={`${name}'s picture`}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bio}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;
