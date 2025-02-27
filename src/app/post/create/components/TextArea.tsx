import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { User, XCircle } from 'lucide-react';
import { debounce } from 'lodash';

interface UserMention {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isPrivate: boolean;
  isVerified: boolean;
}

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const MentionTextarea: React.FC<MentionTextareaProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = ""
}) => {
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionResults, setMentionResults] = useState<UserMention[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate if we're currently in a mention context
  const getMentionInfo = useCallback(() => {
    const curPos = cursorPosition;
    const textBeforeCursor = value.substring(0, curPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol >= 0) {
      // Check if the @ symbol is at the start of text or has a space before it
      const isValidMentionStart = lastAtSymbol === 0 || 
        textBeforeCursor.charAt(lastAtSymbol - 1) === ' ' || 
        textBeforeCursor.charAt(lastAtSymbol - 1) === '\n';
      
      // Check if there's any space after the @ symbol
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
      const hasSpaceAfterAt = /\s/.test(textAfterAt);
      
      if (isValidMentionStart && !hasSpaceAfterAt) {
        return {
          inMention: true,
          query: textAfterAt,
          startIndex: lastAtSymbol,
          endIndex: curPos
        };
      }
    }
    
    return { inMention: false, query: "", startIndex: -1, endIndex: -1 };
  }, [value, cursorPosition]);

  // Debounced search function
  const searchUsers = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 1) {
        setMentionResults([]);
        return;
      }
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        setMentionResults(data.users.slice(0, 5));
      } catch (error) {
        console.error('Error searching for users:', error);
        setMentionResults([]);
      }
    }, 500),
    []
  );

  // Handle cursor position changes
  const handleCursorChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Update cursor position
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Check for mention context whenever the text or cursor position changes
  useEffect(() => {
    const mentionInfo = getMentionInfo();
    
    if (mentionInfo.inMention) {
      setMentionSearch(mentionInfo.query);
      setShowMentionDropdown(true);
      searchUsers(mentionInfo.query);
    } else {
      setShowMentionDropdown(false);
      setMentionIndex(-1);
    }
  }, [value, cursorPosition, getMentionInfo, searchUsers]);

  // Insert the selected mention into the text
  const insertMention = (user: UserMention) => {
    const mentionInfo = getMentionInfo();
    
    if (mentionInfo.inMention && mentionInfo.startIndex !== -1) {
      const beforeMention = value.substring(0, mentionInfo.startIndex);
      const afterMention = value.substring(mentionInfo.endIndex);
      
      // Insert the username with a space after
      const newText = `${beforeMention}@${user.username} ${afterMention}`;
      onChange(newText);
      
      // Calculate new cursor position (after the inserted mention)
      const newPosition = mentionInfo.startIndex + user.username.length + 2; // +2 for the @ and space
      
      // Set the cursor position after the mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
        }
      }, 0);
    }
    
    // Close the dropdown
    setShowMentionDropdown(false);
    setMentionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMentionDropdown) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setMentionIndex((prev) => 
        prev < mentionResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && mentionIndex >= 0 && mentionResults[mentionIndex]) {
      e.preventDefault();
      insertMention(mentionResults[mentionIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowMentionDropdown(false);
      setMentionIndex(-1);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        textareaRef.current && 
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowMentionDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        placeholder={placeholder}
        className={`w-full ${className}`}
      />
      
      {showMentionDropdown && mentionResults.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          <div className="p-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800">
            Users matching "@{mentionSearch}"
          </div>
          {mentionResults.map((user, index) => (
            <div
              key={user.uid}
              className={`flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${
                index === mentionIndex ? 'bg-gray-100 dark:bg-slate-800' : ''
              }`}
              onClick={() => insertMention(user)}
            >
              {user.profilePhotoURL ? (
                <img 
                  src={user.profilePhotoURL} 
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full mr-2" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 mr-2 flex items-center justify-center">
                  <User size={16} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user.displayName}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};