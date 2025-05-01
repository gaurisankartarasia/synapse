import React from 'react';
import { Typography, Box } from '@mui/material';

interface JobDescriptionProps {
    description?: string | null;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ description }) => {
    return (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" fontWeight="semibold" color="text.primary" mb={2}>
                Job Description
            </Typography>
            <Typography variant="body1" color="text.secondary" whiteSpace="pre-wrap">
                {description}
            </Typography>
        </Box>
    );
};

export default JobDescription;