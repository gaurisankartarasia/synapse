

// src/components/store/RecommendedProductsCarousel.tsx

"use client"; // This component needs interactivity, so mark as Client Component

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // For linking to product pages
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Product } from '@/types/store/types'; // Adjust path if necessary

// Import MUI components
import { IconButton, Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function RecommendedProductsCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const swiperRef = useRef<SwiperRef>(null);
    
    // State to track if we can navigate left/right
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch from the relative API route
                const res = await fetch('/api/v1/store/recommendations');
                if (!res.ok) {
                    throw new Error(`Failed to fetch recommendations: ${res.statusText}`);
                }
                const data = await res.json();
                if (data.error) {
                     throw new Error(data.error);
                }
                setProducts(data.products || []);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError(err.message || 'Could not load recommendations.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (products.length === 0) {
        // Don't render the section if there are no recommendations
        return null;
    }

    // Handle swiper events to track position
    const handleSwiperInit = (swiper: any) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const handleSwiperSlideChange = (swiper: any) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <Box sx={{ py: 4}}>
            <Box sx={{ maxWidth: 'xl', mx: 'auto', px: 2, position: 'relative' }}>
                <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 3, 
                        fontWeight: 500 
                    }}
                >
                    Our Top Recommendations.
                </Typography>

                <Box sx={{ position: 'relative' }}>
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        spaceBetween={20}
                        slidesPerView={2}
                        onInit={handleSwiperInit}
                        onSlideChange={handleSwiperSlideChange}
                        breakpoints={{
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                            1024: {
                                slidesPerView: 5,
                                spaceBetween: 30,
                            },
                        }}
                        className="!pb-4"
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product.id} className="h-auto">
                                <Link href={`/store/products/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <Card 
                                        sx={{
                                            '&:hover': {
                                                boxShadow: 1
                                            }
                                        }}
                                    >
                                        <CardContent  >
                                        <Image
                                        className='rounded-xl'
                                            src={product.imageUrl}
                                            alt={product.name ?? 'Recommended product'}
                                            width={200}
                                            height={200}
                                            style={{ objectFit: "contain", maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                        <Typography 
                                        sx={{ 
                                            fontSize: '0.875rem', 
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            
                                        }}
                                    >
                                        {product.name}
                                    </Typography>
                                    </CardContent>  
                                    </Card>
                                    
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Only show the left button if we're not at the beginning */}
                    {!isBeginning && (
                        <IconButton
                            aria-label="Previous slide"
                            onClick={() => swiperRef.current?.swiper.slidePrev()}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: { xs: 0, md: -16 },
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: 2,
                                '&:hover': {
                                    bgcolor: 'grey.100'
                                }
                            }}
                        >
                            <ArrowBackIosIcon fontSize="small" />
                        </IconButton>
                    )}

                    {/* Only show the right button if we're not at the end */}
                    {!isEnd && (
                        <IconButton
                            aria-label="Next slide"
                            onClick={() => swiperRef.current?.swiper.slideNext()}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: { xs: 0, md: -16 },
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                bgcolor: 'white',
                                boxShadow: 2,
                                '&:hover': {
                                    bgcolor: 'grey.100'
                                }
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </Box>
        </Box>
    );
}