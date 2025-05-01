import React from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';

interface JobRequirementsProps {
    requirements?: string[];
}

const JobRequirements: React.FC<JobRequirementsProps> = ({ requirements }) => {
    if (!requirements || requirements.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" fontWeight="semibold" color="text.primary" mb={2}>
                Requirements
            </Typography>
            <List disablePadding>
                {requirements.map((req, index) => (
                    <ListItem key={index} disableGutters sx={{ display: 'list-item', listStyleType: 'disc', ml: 2 }}>
                        <ListItemText primary={req} primaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default JobRequirements;