import React from "react";
import Modal from "../../components/Modal";
import Link from "next/link";
import { Avatar, Spinner } from "@nextui-org/react";

const ModalList: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
  items: any[];
}> = ({ isOpen, onClose, title, loading, items }) => {
  return (
    <Modal  isOpen={isOpen} onClose={onClose} title={title}>
   <div className="p-5">
      {loading ? (
       <Spinner/>
      ) : (
        <ul >
          {items.map((item) => (
            
            <li key={item.uid} className="flex m-2">
               <Avatar src={`/api/proxy?url=${encodeURIComponent(item.photoURL)}`}
              alt="" />
            <div>
            <Link href={`/${item.username}`}> {item.username}</Link>
            <p className="text-gray-400">{item.displayName}</p>
            </div>
            
              
              </li>
          ))}
        </ul>
      )}
      </div>
    </Modal>
  );
};

export default ModalList;
