// import React from 'react';
// import { useQRCode } from 'next-qrcode';

// interface QRCodeGeneratorProps {
//   text: string;
//   width?: number;
//   height?: number;
//   [key: string]: any; // Additional props
// }

// const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ text, width = 200, height = 200, ...props }) => {
//   const { Canvas } = useQRCode();

//   return (
//     <Canvas
//       text={text}
//       options={{
//         errorCorrectionLevel: 'M', 
//         margin: 3,
//         scale: 4,
//         width: width,
//         color: {
//           dark: '#000000',
//           light: '#FFFFFF',
//         },
//         ...props, // Spread additional props
//       }}
//     />
//   );
// };

// export default QRCodeGenerator;








import React from 'react';
import { useQRCode } from 'next-qrcode';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface QRCodeButtonProps {
  text: string;
  buttonText?: string;
  width?: number;
  [key: string]: any; // Additional props
}

const QRCodeGenerator: React.FC<QRCodeButtonProps> = ({
  text,
  buttonText = "Show QR Code",
  width = 200,
  ...props
}) => {
  const { Canvas } = useQRCode();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span>{buttonText}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex flex-col items-center">
          <Canvas
            text={text}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: width,
              color: {
                dark: '#000000',
                light: '#FFFFFF',
              },
              ...props, // Spread additional props for options
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QRCodeGenerator;