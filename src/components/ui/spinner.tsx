// // Spinner.tsx
// "use client";

// import * as React from "react";
// import { Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface CircularProgressProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
//   className?: string;
// }

// const Spinner = React.forwardRef<SVGSVGElement, CircularProgressProps>(
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


import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 25, color = "gray" }) => {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="path"
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
        stroke={color}
      ></circle>
    </svg>
  );
};

export  {Spinner};

// CSS (Add to a global stylesheet or use a CSS-in-JS solution)
const styles = `
.spinner {
  animation: rotator 1.4s linear infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

.path {
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite;
}

@keyframes dash {
  0% { stroke-dashoffset: 187; }
  50% { stroke-dashoffset: 46.75; transform: rotate(135deg); }
  100% { stroke-dashoffset: 187; transform: rotate(450deg); }
}`;

// Add styles to document head
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}
