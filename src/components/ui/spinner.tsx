// spinner.tsx
"use client";

import * as React from "react";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 24, className, ...props }, ref) => {
    return (
      <Loader
        ref={ref}
        width={size}
        height={size}
        className={cn("animate-spin", className)}
        {...props}
      />
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
