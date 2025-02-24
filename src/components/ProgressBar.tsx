'use client';
 
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
 
const ProgressBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="4px"
      color="#000"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export  {ProgressBar};