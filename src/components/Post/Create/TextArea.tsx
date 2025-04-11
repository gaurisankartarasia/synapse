
// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { User } from 'lucide-react';
// import { debounce } from 'lodash';
// import Image from 'next/image';

// import { TextField, Card, CardContent, CardActionArea } from '@mui/material';

// interface UserMention {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isPrivate: boolean;
//   isVerified: boolean;
// }

// interface MentionTextareaProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   className?: string;
// }

// export const MentionTextarea: React.FC<MentionTextareaProps> = ({
//   value,
//   onChange,
//   placeholder = "Write your content here...",
//   className = ""
// }) => {
//   const [mentionSearch, setMentionSearch] = useState("");
//   const [mentionResults, setMentionResults] = useState<UserMention[]>([]);
//   const [showMentionDropdown, setShowMentionDropdown] = useState(false);
//   const [mentionIndex, setMentionIndex] = useState(-1);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Calculate if we're currently in a mention context
//   const getMentionInfo = useCallback(() => {
//     const curPos = cursorPosition;
//     const textBeforeCursor = value.substring(0, curPos);
//     const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
//     if (lastAtSymbol >= 0) {
//       // Check if the @ symbol is at the start of text or has a space before it
//       const isValidMentionStart = lastAtSymbol === 0 || 
//         textBeforeCursor.charAt(lastAtSymbol - 1) === ' ' || 
//         textBeforeCursor.charAt(lastAtSymbol - 1) === '\n';
      
//       // Check if there's any space after the @ symbol
//       const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
//       const hasSpaceAfterAt = /\s/.test(textAfterAt);
      
//       if (isValidMentionStart && !hasSpaceAfterAt) {
//         return {
//           inMention: true,
//           query: textAfterAt,
//           startIndex: lastAtSymbol,
//           endIndex: curPos
//         };
//       }
//     }
    
//     return { inMention: false, query: "", startIndex: -1, endIndex: -1 };
//   }, [value, cursorPosition]);

//   // Create the search function with proper dependencies
//   const handleSearchUsers = useCallback(async (query: string) => {
//     if (!query || query.length < 1) {
//       setMentionResults([]);
//       return;
//     }
    
//     try {
//       const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
//       if (!response.ok) {
//         throw new Error('Search failed');
//       }
      
//       const data = await response.json();
//       setMentionResults(data.users.slice(0, 5));
//     } catch (error) {
//       console.error('Error searching for users:', error);
//       setMentionResults([]);
//     }
//   }, [setMentionResults]);
  
//   // Debounce the search function and memoize it
//   const searchUsers = useMemo(
//     () => debounce(handleSearchUsers, 500),
//     [handleSearchUsers]
//   );

//   // Handle cursor position changes
//   const handleCursorChange = () => {
//     if (textareaRef.current) {
//       setCursorPosition(textareaRef.current.selectionStart);
//     }
//   };

//   // Handle text changes
//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     onChange(newValue);
    
//     // Update cursor position
//     if (textareaRef.current) {
//       setCursorPosition(textareaRef.current.selectionStart);
//     }
//   };

//   // Check for mention context whenever the text or cursor position changes
//   useEffect(() => {
//     const mentionInfo = getMentionInfo();
    
//     if (mentionInfo.inMention) {
//       setMentionSearch(mentionInfo.query);
//       setShowMentionDropdown(true);
//       searchUsers(mentionInfo.query);
//     } else {
//       setShowMentionDropdown(false);
//       setMentionIndex(-1);
//     }
//   }, [value, cursorPosition, getMentionInfo, searchUsers]);

//   // Insert the selected mention into the text
//   const insertMention = (user: UserMention) => {
//     const mentionInfo = getMentionInfo();
    
//     if (mentionInfo.inMention && mentionInfo.startIndex !== -1) {
//       const beforeMention = value.substring(0, mentionInfo.startIndex);
//       const afterMention = value.substring(mentionInfo.endIndex);
      
//       // Insert the username with a space after
//       const newText = `${beforeMention}@${user.username} ${afterMention}`;
//       onChange(newText);
      
//       // Calculate new cursor position (after the inserted mention)
//       const newPosition = mentionInfo.startIndex + user.username.length + 2; // +2 for the @ and space
      
//       // Set the cursor position after the mention
//       setTimeout(() => {
//         if (textareaRef.current) {
//           textareaRef.current.focus();
//           textareaRef.current.setSelectionRange(newPosition, newPosition);
//           setCursorPosition(newPosition);
//         }
//       }, 0);
//     }
    
//     // Close the dropdown
//     setShowMentionDropdown(false);
//     setMentionIndex(-1);
//   };

//   // Insert selected emoji into text
//   const handleEmojiSelect = (emoji: any) => {
//     if (textareaRef.current) {
//       const start = textareaRef.current.selectionStart;
//       const end = textareaRef.current.selectionEnd;
      
//       const newText = value.substring(0, start) + emoji.native + value.substring(end);
//       onChange(newText);
      
//       // Set cursor position after the inserted emoji
//       const newPosition = start + emoji.native.length;
      
//       setTimeout(() => {
//         if (textareaRef.current) {
//           textareaRef.current.focus();
//           textareaRef.current.setSelectionRange(newPosition, newPosition);
//           setCursorPosition(newPosition);
//         }
//       }, 0);
//     }
   
//   };

 

//   // Handle keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (showMentionDropdown) {
//       if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         setMentionIndex((prev) => 
//           prev < mentionResults.length - 1 ? prev + 1 : prev
//         );
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         setMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
//       } else if (e.key === 'Enter' && mentionIndex >= 0 && mentionResults[mentionIndex]) {
//         e.preventDefault();
//         insertMention(mentionResults[mentionIndex]);
//       } else if (e.key === 'Escape') {
//         e.preventDefault();
//         setShowMentionDropdown(false);
//         setMentionIndex(-1);
//       }
//     } 
//   };

//   return (
//     <div className="relative w-full">
//       <div className="flex flex-col w-full">
//         <textarea
//           ref={textareaRef}
//           value={value}
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           onClick={handleCursorChange}
//           onKeyUp={handleCursorChange}
//           placeholder={placeholder}
//           className={`w-full border-2 ${className}`}
//         />
       
//       </div>

//       {/* Mention dropdown */}
//       {showMentionDropdown && mentionResults.length > 0 && (
//         <Card 
//           ref={dropdownRef}
//           className="absolute z-10 mt-1 max-h-60 overflow-y-auto"
//         >
//           <CardContent>
//           <div className="p-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-800">
//             "@{mentionSearch}"
//           </div>
//           {mentionResults.map((user, index) => (
//             <CardActionArea>
//             <div
//               key={user.uid}
//               className={`flex items-center p-2 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer ${
//                 index === mentionIndex ? 'bg-gray-100 dark:bg-slate-800' : ''
//               }`}
//               onClick={() => insertMention(user)}
//             >
//               {user.profilePhotoURL ? (
//                 <Image 
//                   src={user.profilePhotoURL} 
//                   alt={user.displayName}
//                   height={35} 
//                   width={35}
//                   className="rounded-full mr-2 object-cover" 
//                 />
//               ) : (
//                 <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 mr-2 flex items-center justify-center">
//                   <User size={16} />
//                 </div>
//               )}
//               <div className="flex flex-col">
//                 <span className="font-medium text-sm">{user.displayName}</span>
//                 <span className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</span>
//               </div>
//             </div>
//             </CardActionArea>
//           ))}
//           </CardContent>
//         </Card>
//       )}
      
   
//     </div>
//   );
// };








// // src/components/MentionTextarea.tsx (or wherever it resides)
// import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
// import { TextField, Box } from '@mui/material';
// import { debounce } from 'lodash';
// import { MentionDropdown } from './TextArea/MentionDropdown'; // Adjust path as needed

// // Keep the UserMention interface definition here or import from a shared types file
// interface UserMention {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isPrivate: boolean;
//   isVerified: boolean;
// }

// interface MentionTextareaProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   className?: string; // Keep for potential outer styling
//   textFieldProps?: Omit<React.ComponentProps<typeof TextField>, 'value' | 'onChange' | 'multiline' | 'inputRef'>; // Allow passing extra props to TextField
// }

// export const MentionTextarea: React.FC<MentionTextareaProps> = ({
//   value,
//   onChange,
//   placeholder = "Write your content here...",
//   className = "",
//   textFieldProps = {}, // Default to empty object
// }) => {
//   const [mentionSearch, setMentionSearch] = useState("");
//   const [mentionResults, setMentionResults] = useState<UserMention[]>([]);
//   const [showMentionDropdown, setShowMentionDropdown] = useState(false);
//   const [mentionIndex, setMentionIndex] = useState(-1); // Start at -1 (no selection)
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the actual textarea *inside* TextField
//   const containerRef = useRef<HTMLDivElement>(null); // Ref for the container div around TextField

//   // --- Mention Detection Logic (largely unchanged) ---
//   const getMentionInfo = useCallback(() => {
//     // Ensure textareaRef.current exists before accessing properties
//     const inputElement = textareaRef.current;
//     if (!inputElement) return { inMention: false, query: "", startIndex: -1, endIndex: -1 };

//     const curPos = inputElement.selectionStart;
//     const textBeforeCursor = value.substring(0, curPos);
//     const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

//     if (lastAtSymbol >= 0) {
//       const isValidMentionStart = lastAtSymbol === 0 ||
//         /\s|\n/.test(textBeforeCursor.charAt(lastAtSymbol - 1)); // Check for space or newline before @

//       // Check for space *immediately* after @ or within the potential query
//       const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
//       const hasSpaceInQuery = /\s/.test(textAfterAt);

//       if (isValidMentionStart && !hasSpaceInQuery) {
//         return {
//           inMention: true,
//           query: textAfterAt,
//           startIndex: lastAtSymbol,
//           endIndex: curPos
//         };
//       }
//     }

//     return { inMention: false, query: "", startIndex: -1, endIndex: -1 };
//   }, [value]); // Removed cursorPosition dependency, use ref directly


//   // --- API Search Logic (unchanged, ensure error handling is robust) ---
//   const handleSearchUsers = useCallback(async (query: string) => {
//     if (!query || query.length < 1) {
//       setMentionResults([]);
//       // Optionally close dropdown if query becomes empty
//       // setShowMentionDropdown(false);
//       return;
//     }

//     console.log("Searching for:", query); // Debug log
//     try {
//       // **IMPORTANT**: Replace with your actual API endpoint
//       const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}&limit=5`); // Example: add limit
//       if (!response.ok) {
//         console.error('Search request failed with status:', response.status);
//         throw new Error('Search failed');
//       }

//       const data = await response.json();
//        // Ensure data.users exists and is an array
//       const users = Array.isArray(data?.users) ? data.users : [];
//       setMentionResults(users.slice(0, 5)); // Limit results client-side too
//        // Keep dropdown open only if results are found
//        setShowMentionDropdown(users.length > 0);
//        setMentionIndex(-1); // Reset index on new results


//     } catch (error) {
//       console.error('Error searching for users:', error);
//       setMentionResults([]);
//       setShowMentionDropdown(false); // Close dropdown on error
//     }
//   }, []); // Removed setMentionResults dependency (it's stable)

//   // Debounced search function
//   const searchUsers = useMemo(
//     () => debounce(handleSearchUsers, 300), // Adjust debounce timing if needed
//     [handleSearchUsers]
//   );

//   // --- Event Handlers ---

//   // Update cursor position state (needed for getMentionInfo dependency)
//    // Debounced version to avoid excessive updates
//    const debouncedUpdateCursorPosition = useCallback(debounce(() => {
//     if (textareaRef.current) {
//       setCursorPosition(textareaRef.current.selectionStart);
//     }
//   }, 100), []); // Debounce slightly

//   const handleSelectionChange = () => {
//     // Use debounced version or direct call if debounce causes issues
//     debouncedUpdateCursorPosition();
//      if (textareaRef.current) {
//       setCursorPosition(textareaRef.current.selectionStart);
//     }
//   };


//   // Handle text changes in the TextField
//   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const newValue = e.target.value;
//     onChange(newValue);
//      // No need to explicitly set cursor here, handleSelectionChange covers it
//   };

//   // Insert the selected mention
//   const insertMention = useCallback((user: UserMention) => {
//     const inputElement = textareaRef.current;
//     if (!inputElement) return;

//     const { inMention, startIndex } = getMentionInfo(); // Re-check state just before insertion

//     if (inMention && startIndex !== -1) {
//       const beforeMention = value.substring(0, startIndex);
//       // Use current selection end to determine the part after the mention query
//       const afterMention = value.substring(inputElement.selectionEnd);

//       // Insert the username with a space after
//       const newText = `${beforeMention}@${user.username} ${afterMention}`;
//       onChange(newText); // Update parent state

//       // Calculate new cursor position (after the inserted mention + space)
//       const newPosition = startIndex + user.username.length + 2; // +1 for @, +1 for space

//       // Use requestAnimationFrame or setTimeout to ensure state update has rendered
//       requestAnimationFrame(() => {
//         if (textareaRef.current) {
//             textareaRef.current.focus();
//             textareaRef.current.setSelectionRange(newPosition, newPosition);
//             // Manually trigger cursor update after setting range programmatically
//             setCursorPosition(newPosition);
//         }
//       });

//       // Close the dropdown
//       setShowMentionDropdown(false);
//       setMentionResults([]); // Clear results
//       setMentionIndex(-1);
//       searchUsers.cancel(); // Cancel any pending debounced search
//     }
//   }, [value, onChange, getMentionInfo, searchUsers]);


//   // Handle keyboard navigation for mentions
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//      // Use `key` for modern browsers
//     const key = e.key;

//     if (showMentionDropdown && mentionResults.length > 0) {
//       if (key === 'ArrowDown') {
//         e.preventDefault(); // Prevent cursor move in textarea
//         setMentionIndex((prev) => (prev < mentionResults.length - 1 ? prev + 1 : prev));
//       } else if (key === 'ArrowUp') {
//         e.preventDefault(); // Prevent cursor move in textarea
//         setMentionIndex((prev) => (prev > 0 ? prev - 1 : 0));
//       } else if (key === 'Enter' || key === 'Tab') { // Handle Enter and Tab to select
//           // Ensure an item is actually selected (index >= 0)
//          if (mentionIndex >= 0 && mentionResults[mentionIndex]) {
//             e.preventDefault(); // Prevent form submit or focus change
//             insertMention(mentionResults[mentionIndex]);
//         } else {
//             // If Enter is pressed but no item is selected, just close the dropdown
//              setShowMentionDropdown(false);
//              setMentionIndex(-1);
//         }

//       } else if (key === 'Escape') {
//         e.preventDefault();
//         setShowMentionDropdown(false);
//         setMentionIndex(-1);
//         setMentionResults([]); // Clear results on escape
//         searchUsers.cancel(); // Cancel any pending search
//       }
//     }
//   };

//     // Handle losing focus (blur)
//     const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
//         // Use relatedTarget to check if focus moved *inside* the dropdown
//         // Note: This relies on the Dropdown being rendered. If it's complex, this might need adjustment.
//         // A simpler approach is often a small setTimeout.
//         const relatedTarget = e.relatedTarget as Node | null;
//          // Check if the new focus target is within the container (textarea or dropdown)
//         if (!containerRef.current?.contains(relatedTarget)) {
//             // Use a short timeout to allow click event on dropdown to process
//             setTimeout(() => {
//                 setShowMentionDropdown(false);
//                 setMentionIndex(-1);
//                 // Don't clear results immediately on blur, maybe user clicks back
//                 // setMentionResults([]);
//                 searchUsers.cancel();
//             }, 150); // Adjust delay as needed
//         }

//         // Propagate blur event if needed via textFieldProps
//          textFieldProps.onBlur?.(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>);
//     };

//   // --- Effect to trigger search based on mention context ---
//   useEffect(() => {
//     const { inMention, query } = getMentionInfo();

//     if (inMention) {
//       setMentionSearch(query); // Update the query state
//       // Don't set showMentionDropdown here, let handleSearchUsers control it based on results
//       searchUsers(query);
//     } else {
//       setShowMentionDropdown(false);
//       setMentionIndex(-1);
//       // Maybe clear results when not in mention context? Optional.
//       // setMentionResults([]);
//       searchUsers.cancel(); // Cancel pending search if user types away from mention
//     }
//   }, [value, cursorPosition, getMentionInfo, searchUsers]); // Depend on cursorPosition

//   return (
//     // Position relative is needed for the absolute positioning of the dropdown
//     <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }} className={className}>
//       <TextField
//         multiline
//         fullWidth // Make TextField take full width of its container
//         value={value}
//         onChange={handleChange}
//         onKeyDown={handleKeyDown} // Attach keydown here
//         onBlur={handleBlur} // Attach blur here
//         // Use onClick and onKeyUp on the *input* itself to track selection changes
//         // MUI forwards these to the input element via inputProps
//         inputProps={{
//             onClick: handleSelectionChange,
//             onKeyUp: handleSelectionChange, // Handles arrow keys, backspace etc.
//             onSelect: handleSelectionChange, // More robust selection tracking
//             'aria-autocomplete': 'list', // Accessibility hint
//             'aria-controls': showMentionDropdown ? 'mention-listbox' : undefined, // Link input to listbox
//             'aria-activedescendant': (showMentionDropdown && mentionIndex >= 0 && mentionResults[mentionIndex])
//                 ? `mention-option-${mentionResults[mentionIndex].uid}` // Link to active option
//                 : undefined,
//         }}
//         inputRef={textareaRef} // Get ref to the underlying textarea element
//         placeholder={placeholder}
//         {...textFieldProps} // Spread any additional props
//         sx={{ // Example sx styling for TextField
//              '& .MuiOutlinedInput-root': { // Target the input root
//                  paddingBottom: '30px', // Add padding if emoji picker overlaps
//              },
//              ...textFieldProps?.sx // Merge with passed sx props
//         }}

//       />

//        {/* Conditionally render the MentionDropdown */}
//        {/* Pass the container div as the anchor element */}
//         {showMentionDropdown && containerRef.current && (
//             <MentionDropdown
//                 results={mentionResults}
//                 selectedIndex={mentionIndex}
//                 onSelect={insertMention}
//                 mentionQuery={mentionSearch}
//                 anchorEl={containerRef.current} // Use the container for positioning reference
//              />
//         )}


//       {/* Keep Emoji Picker if needed - Position it appropriately */}
//       {/* Example: Position emoji picker at the bottom right */}
//       {/* <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}> */}
//       {/* <YourEmojiPickerComponent onEmojiSelect={handleEmojiSelect} /> */}
//       {/* </Box> */}
//     </Box>
//   );
// };







// src/components/MentionTextarea.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TextField, Box, TextFieldProps } from '@mui/material'; // Import TextFieldProps
import { debounce } from 'lodash';
import { MentionDropdown } from './TextArea/MentionDropdown';

interface UserMention {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isPrivate: boolean;
  isVerified: boolean;
}

// Refine props: Remove onKeyDown/onBlur from textFieldProps if handled internally now
type CustomTextFieldProps = Omit<TextFieldProps, 'value' | 'onChange' | 'multiline' | 'inputRef' | 'onKeyDown' | 'onBlur' | 'inputProps'>;

interface MentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  textFieldProps?: CustomTextFieldProps; // Use the refined type
}

export const MentionTextarea: React.FC<MentionTextareaProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  className = "",
  textFieldProps = {},
}) => {
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionResults, setMentionResults] = useState<UserMention[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getMentionInfo = useCallback(() => {
    const inputElement = textareaRef.current;
    if (!inputElement) return { inMention: false, query: "", startIndex: -1, endIndex: -1 };
    const curPos = inputElement.selectionStart;
    const textBeforeCursor = value.substring(0, curPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    if (lastAtSymbol >= 0) {
      const isValidMentionStart = lastAtSymbol === 0 || /\s|\n/.test(textBeforeCursor.charAt(lastAtSymbol - 1));
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
      const hasSpaceInQuery = /\s/.test(textAfterAt);
      if (isValidMentionStart && !hasSpaceInQuery) {
        return { inMention: true, query: textAfterAt, startIndex: lastAtSymbol, endIndex: curPos };
      }
    }
    return { inMention: false, query: "", startIndex: -1, endIndex: -1 };
  }, [value]);

  const handleSearchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setMentionResults([]); setShowMentionDropdown(false); return;
    }
    try {
      // Replace with your actual API call
      const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      const users = Array.isArray(data?.users) ? data.users.slice(0, 5) : [];
      setMentionResults(users);
      setShowMentionDropdown(users.length > 0);
      setMentionIndex(-1);
    } catch (error) {
      console.error('Error searching users:', error);
      setMentionResults([]); setShowMentionDropdown(false);
    }
  }, []);

  const searchUsers = useMemo(() => debounce(handleSearchUsers, 300), [handleSearchUsers]);

  const handleSelectionChange = useCallback(() => {
    if (textareaRef.current) setCursorPosition(textareaRef.current.selectionStart);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const insertMention = useCallback((user: UserMention) => {
    const inputElement = textareaRef.current;
    if (!inputElement) return;
    const { inMention, startIndex } = getMentionInfo();
    if (inMention && startIndex !== -1) {
      const before = value.substring(0, startIndex);
      const after = value.substring(inputElement.selectionEnd);
      const newText = `${before}@${user.username} ${after}`;
      onChange(newText);
      const newPos = startIndex + user.username.length + 2;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPos, newPos);
          setCursorPosition(newPos);
        }
      });
      setShowMentionDropdown(false); setMentionResults([]); setMentionIndex(-1); searchUsers.cancel();
    }
  }, [value, onChange, getMentionInfo, searchUsers]);

  // Handler type remains correct for input/textarea events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.key;
    if (showMentionDropdown && mentionResults.length > 0) {
      let handled = true; // Assume handled if dropdown is open
      if (key === 'ArrowDown') {
        setMentionIndex(prev => (prev < mentionResults.length - 1 ? prev + 1 : 0));
      } else if (key === 'ArrowUp') {
        setMentionIndex(prev => (prev > 0 ? prev - 1 : mentionResults.length - 1));
      } else if (key === 'Enter' || key === 'Tab') {
        if (mentionIndex >= 0 && mentionResults[mentionIndex]) {
          insertMention(mentionResults[mentionIndex]);
        } else {
          setShowMentionDropdown(false); setMentionIndex(-1);
          handled = false; // Allow default if no selection
        }
      } else if (key === 'Escape') {
        setShowMentionDropdown(false); setMentionIndex(-1); setMentionResults([]); searchUsers.cancel();
      } else {
        handled = false; // Not a mention navigation key
      }

      if (handled) {
        e.preventDefault(); // Prevent default only for handled keys
      }
    }
    // Note: No propagation via textFieldProps.onKeyDown needed here
    // as the handler is now directly on the input element.
    // If a consumer *really* needed a keydown on the wrapper div, they'd pass it via textFieldProps.
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as Node | null;
    if (!containerRef.current?.contains(relatedTarget)) {
      setTimeout(() => { // Delay to allow dropdown item clicks
          if (containerRef.current) { // Check component still mounted
              setShowMentionDropdown(false); setMentionIndex(-1); searchUsers.cancel();
          }
      }, 150);
    }
     // Note: No propagation via textFieldProps.onBlur needed here if handled internally.
  };

  useEffect(() => {
    const { inMention, query } = getMentionInfo();
    if (inMention) {
      setMentionSearch(query); searchUsers(query);
    } else {
      if (showMentionDropdown) { setShowMentionDropdown(false); setMentionIndex(-1); }
      searchUsers.cancel();
    }
  }, [value, cursorPosition, getMentionInfo, searchUsers, showMentionDropdown]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }} className={className}>
      <TextField
        multiline
        fullWidth
        value={value}
        onChange={handleChange}
        // REMOVED from top level: onKeyDown={handleKeyDown}
        // REMOVED from top level: onBlur={handleBlur}
        inputRef={textareaRef}
        placeholder={placeholder}
        {...textFieldProps} // Spread consumer props for the TextField itself
        InputProps={{ // Use InputProps to pass props to the underlying component containing the input
             ...(textFieldProps.InputProps || {}), // Merge with consumer's InputProps if any
             onBlur: handleBlur, // Attach blur handler here (usually targets the input)
        }}
        inputProps={{ // Use inputProps to pass props directly TO the native <textarea> element
            onClick: handleSelectionChange,
            onKeyUp: handleSelectionChange, // Handles cursor movement via arrow keys etc.
            onKeyDown: handleKeyDown,   // <<< MOVED HERE: Attach keydown handler directly to the textarea
            'aria-autocomplete': 'list',
            'aria-controls': showMentionDropdown ? 'mention-listbox' : undefined,
            'aria-activedescendant': (showMentionDropdown && mentionIndex >= 0 && mentionResults[mentionIndex])
                ? `mention-option-${mentionResults[mentionIndex].uid}`
                : undefined,
             // Removed merge with textFieldProps.inputProps as we handle essential ones
        }}
        sx={{ // Example styling merge
             '& .MuiOutlinedInput-root': { paddingBottom: '30px' }, // Keep space if needed
             ...textFieldProps?.sx
        }}
      />

       {showMentionDropdown && containerRef.current && (
            <MentionDropdown
                results={mentionResults}
                selectedIndex={mentionIndex}
                onSelect={insertMention}
                mentionQuery={mentionSearch}
                anchorEl={containerRef.current}
             />
        )}
    </Box>
  );
};