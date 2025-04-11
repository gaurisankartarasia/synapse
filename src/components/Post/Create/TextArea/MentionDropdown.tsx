// src/components/MentionDropdown.tsx
import React, { useEffect, useRef } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Person } from '@mui/icons-material';

interface UserMention {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isPrivate: boolean; // Keep these if needed, though not used in display here
  isVerified: boolean;
}

interface MentionDropdownProps {
  results: UserMention[];
  selectedIndex: number;
  onSelect: (user: UserMention) => void;
  mentionQuery: string;
  anchorEl: HTMLElement | null; // Element to anchor the dropdown to
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  results,
  selectedIndex,
  onSelect,
  mentionQuery,
  anchorEl,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const selectedItemRef = useRef<HTMLLIElement>(null);

  // Scroll the selected item into view when the index changes
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest', // 'smooth', 'center', 'start', 'end' also possible
        inline: 'nearest',
      });
    }
    // Alternative: scroll the whole list container if needed
    // const list = listRef.current;
    // const selectedItem = list?.children[selectedIndex + 1]; // +1 to account for the header Typography
    // if (list && selectedItem) {
    //   const { offsetTop, offsetHeight } = selectedItem as HTMLElement;
    //   const { scrollTop, clientHeight } = list;
    //   if (offsetTop < scrollTop) {
    //     list.scrollTop = offsetTop;
    //   } else if (offsetTop + offsetHeight > scrollTop + clientHeight) {
    //     list.scrollTop = offsetTop + offsetHeight - clientHeight;
    //   }
    // }
  }, [selectedIndex]);

  if (!anchorEl || results.length === 0) {
    return null; // Don't render if no anchor or no results
  }

  // Calculate position based on the anchor (e.g., the TextField)
  const rect = anchorEl.getBoundingClientRect();
  const topPosition = rect.bottom + window.scrollY;
  const leftPosition = rect.left + window.scrollX;

  return (
    <Paper
      elevation={3}
      sx={{
        top: `${topPosition}px`, // Position below the text field
        left: `${leftPosition}px`, // Align with text field start
        zIndex: 1300, // Ensure it's above other elements (MUI modal z-index is ~1300)
        marginTop: '4px', // Small gap
        maxHeight: '240px', // Limit height
        width: 'auto', // Adjust width based on content, or set fixed width
        minWidth: `${rect.width}px`, // Minimum width matching the textfield
        overflowY: 'auto', // **Crucial for scrolling**
      }}
    >
      <List dense ref={listRef}>
        <Box px={2} py={1}>
          <Typography variant="caption" color="text.secondary">
            Mentioning: @{mentionQuery}
          </Typography>
        </Box>
        <Divider />
        {results.map((user, index) => (
          <ListItem
            key={user.uid}
            disablePadding
            // Assign ref conditionally to the selected item
            ref={index === selectedIndex ? selectedItemRef : null}
          >
            <ListItemButton
              selected={index === selectedIndex}
              onClick={() => onSelect(user)}
              sx={{
                  // Add hover styles if needed, ListItemButton provides defaults
              }}
            >
              <ListItemAvatar sx={{ minWidth: 45 }}> {/* Adjust minWidth as needed */}
                <Avatar
                    src={user.profilePhotoURL || undefined} // Pass undefined if empty to let MUI handle fallback
                    alt={user.displayName}
                    sx={{ width: 32, height: 32 }} // Consistent sizing
                >
                  {/* Fallback Icon if no src */}
                  {!user.profilePhotoURL && <Person fontSize='small'  />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" component="span" fontWeight="medium">
                    {user.displayName}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    @{user.username}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};