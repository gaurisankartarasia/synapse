import React from 'react';
import { Typography, Box } from '@mui/material';

interface JobDetailItemProps {
    label: string;
    value: string | undefined;
}

const JobDetailItem: React.FC<JobDetailItemProps> = ({ label, value }) => {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight="semibold" color="text.secondary" gutterBottom>
                {label}
            </Typography>
            <Typography variant="body1" color="text.primary">
                {value || 'Not specified'}
            </Typography>
        </Box>
    );
};

export default JobDetailItem;