

"use client";

import { useInbox } from "@/hooks/inbox/useInboxList"; 
import { format } from "date-fns";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, CardContent, CardActionArea, Box, Avatar } from '@mui/material'; 

import { Verified } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuth";

export default function InboxList() {
const {user} = useAuth()

  // 1. Destructure the correct function name and isLoading state
  // 4. Removed userProfiles from destructuring as it's not directly used here anymore
  const { inboxes, isLoading, getOtherParticipantProfile } = useInbox();

  // 3. Handle loading state for the entire list
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!inboxes || inboxes.length === 0) {
      return (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '50vh', color: 'text.secondary' }}>
            No conversations yet.
          </Box>
      );
  }

if(!user) return

  return (
    <section className="flex w-full justify-center overflow-auto">
      <ul className="w-full space-y-2 p-2"> {/* Added some spacing and padding */}
        {inboxes.map((inbox) => {
          // 2. Get the profile object directly using the correct function
          const otherParticipantProfile = getOtherParticipantProfile(inbox.participants);

          // Format time safely
          const lastMessageTime = inbox.lastMessageTime?.toDate
            ? format(inbox.lastMessageTime.toDate(), "p") // Use 'p' for localized short time
            : "";

          // Use a placeholder or skip rendering if profile is somehow still loading/missing
          if (!otherParticipantProfile) {
            // Optionally render a placeholder or just skip
            // console.warn("Profile not found for inbox:", inbox.id); // Log if needed
            return (
                <li key={inbox.id} className="border-b w-full opacity-50">
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: '70px' }}>
                                <CircularProgress size={20} />
                            </Box>
                        </CardContent>
                    </Card>
                </li>
            );
          }

          // Generate fallback initials
          const fallbackInitials = (otherParticipantProfile.displayName || otherParticipantProfile.username || '??')
                                    .slice(0, 2)
                                    .toUpperCase();

          // Check unread counts safely
          const unreadCount = inbox.unreadCounts && inbox.unreadCounts[user.uid] // Check against current user's ID if unreadCounts is per-user
                             ? inbox.unreadCounts[user.uid]
                             : 0; // Default to 0 if structure doesn't match


          return (
            <li key={inbox.id} className="w-full"> {/* Removed border-b, handled by Card usually */}
              <Card elevation={1} sx={{ backgroundColor: unreadCount > 0 ? 'action.hover' : 'background.paper' }}> {/* Optional: Highlight unread */}
                <CardActionArea component={Link} href={`/inbox/${otherParticipantProfile.uid}`}>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-1"> {/* Use space-x */}
                      <Avatar src={otherParticipantProfile.photoURL.startsWith('http') ? `/api/v1/proxy?url=${encodeURIComponent(otherParticipantProfile.photoURL)}` : otherParticipantProfile.photoURL}
                      alt={otherParticipantProfile.username}
                      > 
                     
                          {fallbackInitials}
                      </Avatar>
                      <div className="flex items-center space-x-1"> {/* Inner flex for name+badge */}
                          <p className="font-medium truncate"> {/* Truncate long names */}
                            {otherParticipantProfile.displayName || otherParticipantProfile.username}
                          </p>
                          {otherParticipantProfile.isVerified && <Verified className="h-4 w-4 text-blue-500" />} {/* Adjust size/color */}
                      </div>
                    </div>
                    <div className="text-sm flex justify-between items-center"> {/* Use flex for message + time */}
                      <span className="opacity-70 truncate flex-grow mr-2"> {/* Truncate long messages */}
                        {inbox.lastMessage || "..."} {/* Placeholder if no message */}
                      </span>
                      {lastMessageTime && (
                        <small className="text-xs opacity-60 whitespace-nowrap"> {/* Prevent time wrapping */}
                           {lastMessageTime}
                        </small>
                      )}
                    </div>

                    {/* Display unread count - adjust logic based on your unreadCounts structure */}
                    {/* Assuming unreadCounts maps userId to count */}
                    {/* {unreadCount > 0 && (
                      <span className="text-xs text-blue-600 font-semibold mt-1 block">
                         {unreadCount} new
                      </span>
                    )} */}
                  </CardContent>
                </CardActionArea>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}






