
// "use client";
// import React, { useEffect, useState } from "react";
// import styles from "./styles/Modal.module.css";


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
//       <div 
      

//       className={styles.modalContent} 
//       onClick={(e) => e.stopPropagation()}
//       >
//         <div className={styles.modalHeader}>
//           <h2>{title}</h2>
//           <button onClick={handleClose} 
//           >
// x          </button>
//         </div>
//         <div className={styles.modalBody}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;




"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" title="Close this modal">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
