import React from "react";
// import { FiLoader } from "react-icons/fi";
// import { LuLoader2 } from "react-icons/lu";
// import { RiLoader5Line } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";
import styles from "./styles/LoaderSpinner.module.css";

interface LoaderSpinnerProps {
  size?: number;  
  color?: string; 
}

const LoaderSpinner: React.FC<LoaderSpinnerProps> = ({ size = 25, color = "#015a95" }) => {
  return (
    <div className="">
      <div className={styles.spinner}>
      <BiLoaderAlt size={size} color={color} />
    </div>
    </div>
  );
};

export default LoaderSpinner;
