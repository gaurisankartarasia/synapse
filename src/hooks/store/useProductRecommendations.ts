// src/components/store/useProductRecommendations.ts
import { useState, useEffect } from 'react';
import { Product } from '@/types/store/types';

export const useProductRecommendations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { products, loading, error };
};