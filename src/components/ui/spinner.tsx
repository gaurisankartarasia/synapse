// // spinner.tsx
// "use client";

// import * as React from "react";
// import { Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
//   className?: string;
// }

// const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
//   ({ size = 24, className, ...props }, ref) => {
//     return (
//       <Loader2
//         ref={ref}
//         width={size}
//         height={size}
//         className={cn("animate-spin", className)}
//         {...props}
//       />

//     );
//   }
// );

// Spinner.displayName = "Spinner";

// export { Spinner };




import React from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface SpinnerProps {
  size?: number; // Size in pixels
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 25,
  color = 'gray',
  strokeWidth = 5,
  animationDuration = 0.75,
}) => (
  <RotatingLines
    strokeColor={color}
    strokeWidth={strokeWidth.toString()}
    animationDuration={animationDuration.toString()}
    width={size.toString()}
    visible={true}
  />
);

export  {Spinner};


