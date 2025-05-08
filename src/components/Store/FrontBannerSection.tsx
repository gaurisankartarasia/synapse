// 'use client';

// import { Box, Button, Container, Typography } from '@mui/material';
// import { FC } from 'react';

// const Banner: FC = () => {
//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         width: '100%',
//         height: { xs: '60vh', md: '80vh' },
//         backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/test_front_banner%2Funnamed.png?alt=media&token=ade2e2a7-e8e6-412a-82da-674092cb698c)',
//         backgroundSize: 'fit',
//         backgroundPosition: 'center',
//         display: 'flex',
//         alignItems: 'center',
//         color: '#fff',
//         borderRadius: '40px',
       
//       }}
//     >
//       <Box
//         sx={{
//           position: 'absolute',
//           inset: 0,
//           backgroundColor: 'rgba(0, 0, 0, 0.4)',
//           borderRadius: '40px',
//         }}
//       />
//       <Container
//         sx={{
//           position: 'relative',
//           zIndex: 1,
//           textAlign: { xs: 'center', md: 'left' },
//         }}
//       >
//         <Typography variant="h3" component="h1" gutterBottom   >
//           Pixel 9 Pro
//         </Typography>
//         <Typography variant="h6" sx={{ mb: 3 }}>
//           Shop the latest trends and exclusive deals now.
//         </Typography>
//         <Button variant="outlined"  size="large" sx={{px:3, fontSize:'1.2rem', border:'none', bgcolor:'white',  color:"black"}} >
//           Shop Now
//         </Button>
//       </Container>
//     </Box>
//   );
// };

// export default Banner;




'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { FC } from 'react';
import { useBanner } from '@/hooks/store/useBanner';
import Link from 'next/link';

const Banner: FC = () => {
  const { banner, isLoading, isError } = useBanner();

  if (isLoading) return <div>Loading banner...</div>;
  if (isError || !banner) return <div>Failed to load banner.</div>;

  return (
    <Box
      sx={{  backgroundImage: `url(${banner.image})`,
        position: 'relative',
        width: '100%',
        height: { xs: '30vh', md: '40vh' },
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        color: '#3c4043',
        borderRadius: '40px',
        border: '1px solid #0000008f',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '40px',
        }}
      />
      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Typography variant="h3" fontWeight={600} component="h1" gutterBottom>
          {banner.title}
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, maxWidth:'300px' }}>
          {banner.description}
        </Typography>
        <Button
        LinkComponent={Link}
          href={banner.buttonUrl}
          variant="outlined"
          size="large"
          sx={{
            px: 3,
            fontSize: '1.2rem',
            color: 'black',
          }}
        >
          {banner.buttonText}
        </Button>
      </Container>
    </Box>
  );
};

export default Banner;
