// src/hooks/useBanner.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useBanner() {
  const { data, error, isLoading } = useSWR('/api/v1/store/banner', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 1000 * 60 * 5, // cache for 5 minutes
  });

  return {
    banner: data,
    isLoading,
    isError: error,
  };
}
