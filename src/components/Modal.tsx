
// "use client";
// import React, { useEffect, useState } from "react";
// import styles from "./styles/Modal.module.css";
// // import { IoCloseSharp } from "react-icons/io5";
// import { GrClose } from "react-icons/gr";
// import {Card} from "@nextui-org/react";
// import {Button} from '@nextui-org/react';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title: string;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
//   const [isVisible, setIsVisible] = useState<boolean>(false);

//   useEffect(() => {
//     if (isOpen) {
//       setIsVisible(true);
//     } else {
//       const timer = setTimeout(() => setIsVisible(false), 300); // Match with animation duration
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen]);

//   const handleClose = () => {
//     setIsVisible(false);
//     setTimeout(() => onClose(), 300); 
//   };

//   return (
//     <div className={`${styles.modalOverlay} ${isVisible ? styles.visible : ""}`} onClick={handleClose}>
//       <Card 
      
//       radius='lg'
//       className={styles.modalContent} 
//       // onPress={(e) => e.stopPropagation()}
//       >
//         <div className={styles.modalHeader}>
//           <h2>{title}</h2>
//           <Button variant='flat' radius="full" onPress={handleClose} 
//           size="sm"
//           color='danger'
//           >
//             <GrClose size={15}/>
//           </Button>
//         </div>
//         <div className={styles.modalBody}>
//           {children}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Modal;



"use client";
import React, { useEffect, useState } from "react";
import {
  Modal as NextUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDraggable,
} from "@nextui-org/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const targetRef = React.useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match with animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  return (
    <NextUIModal
      ref={targetRef}
      isOpen={isVisible}
      onOpenChange={handleClose} // Close modal on overlay clicks
    >
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader {...moveProps} className="flex flex-col gap-1">
           <div className="flex justify-end mr-4 text-gray-400">
           <span className="material-symbols-outlined">
arrows_output
</span>
           </div>
              {title}
          
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            {/* <ModalFooter>
              <Button
                variant="light"
                color="danger"
                onPress={() => {
                  onModalClose();
                  handleClose();
                }}
              >
                Close
              </Button>
              <Button
                variant="solid"
                color="primary"
                onPress={() => {
                  onModalClose();
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </ModalFooter> */}
          </>
        )}
      </ModalContent>
    </NextUIModal>
  );
};

export default Modal;
