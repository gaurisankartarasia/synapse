import React, { useRef, useEffect } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  onClickOutside?: () => void;
  position?: 'top' | 'bottom';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  onClickOutside,
  position = 'bottom',
  theme = 'auto',
  className = '',
}) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // Determine actual theme based on auto setting
  const actualTheme = theme === 'auto' 
    ? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    : theme;
  
  // Handle clicks outside the emoji picker
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClickOutside && onClickOutside();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickOutside]);

  return (
    <div 
      ref={pickerRef}
      className={`z-50 ${position === 'top' ? 'mb-2' : 'mt-2'} ${className}`}
    >
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme={actualTheme}
        previewPosition="none"
        skinTonePosition="none"
        emojiButtonSize={28}
        emojiSize={20}
        perLine={8}
      />
    </div>
  );
};

// Optional: Create a button component that toggles the emoji picker
interface EmojiPickerButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({
  onClick,
  isActive = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 ${
        isActive ? 'bg-gray-100 dark:bg-slate-800' : ''
      } ${className}`}
      aria-label="Add emoji"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    </button>
  );
};