// components/Dropdown.tsx
import React, { useState } from 'react';
import {Button} from '@mui/material'

type DropdownProps = {
  label: string;
  options: { label: string; action: () => void }[];
};

const Dropdown: React.FC<DropdownProps> = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block">
      <Button
        className="px-4 py-2 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none"
        onClick={toggleDropdown}
      >
        {label}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
          {options.map((option, index) => (
            <Button
              key={index}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                option.action();
                setIsOpen(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
