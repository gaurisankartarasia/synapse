
"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles/Modal.module.css";
// import { IoCloseSharp } from "react-icons/io5";
import { GrClose } from "react-icons/gr";
import {Card} from "@nextui-org/react";
import {Button} from '@nextui-org/react';

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
      const timer = setTimeout(() => setIsVisible(false), 300); // Match with animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); 
  };

  return (
    <div className={`${styles.modalOverlay} ${isVisible ? styles.visible : ""}`} onClick={handleClose}>
      <Card 
      
      radius='lg'
      className={styles.modalContent} 
      // onPress={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <Button variant='light' radius="full" onPress={handleClose} 
          size="sm"
          color='danger'
          >
            <GrClose size={15}/>
          </Button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default Modal;






