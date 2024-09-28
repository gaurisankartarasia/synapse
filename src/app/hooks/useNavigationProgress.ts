// hooks/useNavigationProgress.ts
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

const useNavigationProgress = () => {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== prevPathname) {
      NProgress.start();
      NProgress.set(0.98); 
      setPrevPathname(pathname);
    }
  }, [pathname, prevPathname]);

  useEffect(() => {
    const handleComplete = () => NProgress.done();
    
    // Clean up the progress bar after a short delay to simulate loading completion
    const timeout = setTimeout(() => handleComplete(), 500);

    return () => clearTimeout(timeout);
  }, [pathname]);
};

export default useNavigationProgress;
