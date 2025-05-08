// components/Loader.tsx
import React from 'react';

export const StoreLoader: React.FC = () => {
  return (
    <>
      <div className="loader"></div>
      <style jsx>{`
        .loader {
          width: 60px;
          aspect-ratio: 1;
          color: #ffa516;
          background:
            linear-gradient(currentColor 0 0) 100% 0,
            linear-gradient(currentColor 0 0) 0 100%;
          background-size: 50.1% 50.1%;
          background-repeat: no-repeat;
          animation: l7-0 1s infinite steps(1);
          position: relative; /* Needed for positioning pseudo-elements */
        }

        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          inset: 0 50% 50% 0;
          background: currentColor;
          transform: scale(var(--s, 1)) perspective(150px) rotateY(0deg);
          transform-origin: bottom right;
          animation: l7-1 0.5s infinite linear alternate;
        }

        .loader::after {
          --s: -1, -1;
        }

        @keyframes l7-0 {
          0% {
            transform: scaleX(1) rotate(0deg);
          }
          50% {
            transform: scaleX(-1) rotate(-90deg);
          }
        }

        @keyframes l7-1 {
          49.99% {
            transform: scale(var(--s, 1)) perspective(150px) rotateX(-90deg);
            filter: grayscale(0);
          }
          50% {
            transform: scale(var(--s, 1)) perspective(150px) rotateX(-90deg);
            filter: grayscale(0.8);
          }
          100% {
            transform: scale(var(--s, 1)) perspective(150px) rotateX(-180deg);
            filter: grayscale(0.8);
          }
        }
      `}</style>
    </>
  );
};

