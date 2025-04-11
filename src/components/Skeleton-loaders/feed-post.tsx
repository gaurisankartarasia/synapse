


import { Skeleton } from '@mui/material';
import { Box } from '@mui/material'; 

export function PostSkeleton() {
  return (
    <Box sx={{ p: 4, borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Skeleton width={160} height={16} />
          <Skeleton width={80} height={12} />
        </Box>
      </Box>

      {/* Post Image */}
      <Skeleton variant="rectangular" width="100%" height={384} sx={{ borderRadius: '4px' }} /> {/* 96 * 4 = 384 */}

      {/* Engagement */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Skeleton width={48} height={20} />
        <Skeleton width={48} height={20} />
      </Box>
    </Box>
  );
}