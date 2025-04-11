
// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Popper, Fade, CircularProgress, Card, CardContent } from "@mui/material";
// import { useAuth } from "@/hooks/useAuth";
// import { useSelector, useDispatch } from "react-redux";
// import { AppDispatch, RootState } from "@/redux/store";
// import { toggleFollow } from "@/redux/features/followSlice";
// import { UserHoverCardContent } from "./CardContent";
// import { useUserProfile } from "@/hooks/hover-card/useProfile";

// interface UserHoverCardProps {
//   username: string;
//   children: React.ReactNode;
// }

// export function UserHoverCard({ username, children }: UserHoverCardProps) {
//   const [open, setOpen] = useState(false);
//   const anchorRef = useRef<HTMLDivElement>(null);
//   const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
//   const cardRef = useRef<HTMLDivElement>(null);
  
//   const dispatch = useDispatch<AppDispatch>();
//   const { user: authUser } = useAuth();
//   const { profile, isLoading, error } = useUserProfile(username, open);
  
//   const followStatus = useSelector(
//     (state: RootState) => state.follow.followStatus[username] ?? { loading: false }
//   );

//   const handleFollow = () => {
//     if (!authUser || followStatus.loading) return;
//     dispatch(toggleFollow(username));
//   };

//   const clearHoverTimeout = () => {
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//       setHoverTimeout(null);
//     }
//   };

//   // Handle hover events with delay
//   const handleMouseEnter = () => {
//     clearHoverTimeout();
//     const timeout = setTimeout(() => {
//       setOpen(true);
//     }, 800); 
//     setHoverTimeout(timeout);
//   };

//   const handleMouseLeave = (e: React.MouseEvent) => {
//     // Only close if not moving from trigger to card or vice versa
//     const relatedTarget = e.relatedTarget as Node;
//     if (cardRef.current?.contains(relatedTarget) || anchorRef.current?.contains(relatedTarget)) {
//       return;
//     }
    
//     clearHoverTimeout();
//     const timeout = setTimeout(() => {
//       setOpen(false);
//     }, 300);
//     setHoverTimeout(timeout);
//   };

//   // Additional handler for the entire component
//   const handleGlobalMouseLeave = (e: React.MouseEvent) => {
//     const relatedTarget = e.relatedTarget as Node;
//     if (
//       !cardRef.current?.contains(relatedTarget) &&
//       !anchorRef.current?.contains(relatedTarget)
//     ) {
//       clearHoverTimeout();
//       const timeout = setTimeout(() => {
//         setOpen(false);
//       }, 300);
//       setHoverTimeout(timeout);
//     }
//   };

//   // Clean up timeouts
//   useEffect(() => {
//     return () => {
//       clearHoverTimeout();
//     };
//   }, []);

//   return (
//     <div onMouseLeave={handleGlobalMouseLeave}>
//       <div 
//         ref={anchorRef}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//       >
//         {children}
//       </div>
      
//       <Popper
//         open={open}
//         anchorEl={anchorRef.current}
//         placement="bottom-start"
//         transition
//         sx={{zIndex:9999}}
//       >
//         {({ TransitionProps }) => (
//           <Fade {...TransitionProps} timeout={200}>
//             <div ref={cardRef}>
//               <Card 
//                 sx={{ width: 350, height: 192, boxShadow:5}}
//                 onMouseEnter={handleMouseEnter}
//                 onMouseLeave={handleMouseLeave}
//               >
//                 <CardContent>
//                   {isLoading ? (
//                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
//                       <CircularProgress />
//                     </div>
//                   ) : error ? (
//                     <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>
//                   ) : profile ? (
//                     <UserHoverCardContent profile={profile} onFollowClick={handleFollow} />
//                   ) : null}
//                 </CardContent>
//               </Card>
//             </div>
//           </Fade>
//         )}
//       </Popper>
//     </div>
//   );
// }










"use client";
import { useState, useRef, useEffect } from "react"; // No need for useCallback here anymore
import { Popper, Fade, CircularProgress, Card, CardContent } from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleFollow } from "@/redux/features/followSlice";
import { UserHoverCardContent } from "./CardContent";
import { useUserProfile } from "@/hooks/hover-card/useProfile";

interface UserHoverCardProps {
  username: string;
  children: React.ReactNode;
}

export function UserHoverCard({ username, children }: UserHoverCardProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  // Use a ref to store the timeout ID - this doesn't trigger re-renders
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user: authUser } = useAuth();
  const { profile, isLoading, error } = useUserProfile(username, open);

  const followStatus = useSelector(
    (state: RootState) => state.follow.followStatus[username] ?? { loading: false }
  );

  const handleFollow = () => {
    if (!authUser || followStatus.loading) return;
    dispatch(toggleFollow(username));
  };

  // Function to clear the timeout using the ref
  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Handle hover events with delay
  const handleMouseEnter = () => {
    // Clear any existing leave timeout
    clearHoverTimeout();
    // Set a new timeout to open the card
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 800);
    // Store the timeout ID in the ref
    hoverTimeoutRef.current = timeout;
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only close if not moving from trigger to card or vice versa
    const relatedTarget = e.relatedTarget as Node;
    if (cardRef.current?.contains(relatedTarget) || anchorRef.current?.contains(relatedTarget)) {
      return;
    }

    // Clear any existing enter timeout
    clearHoverTimeout();
    // Set a new timeout to close the card
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 300);
    // Store the timeout ID in the ref
    hoverTimeoutRef.current = timeout;
  };

  // Additional handler for the entire component group (trigger + card)
  const handleGlobalMouseLeave = (e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as Node;
    // Check if the mouse is moving outside both the trigger and the card
    if (
      !cardRef.current?.contains(relatedTarget) &&
      !anchorRef.current?.contains(relatedTarget)
    ) {
      // Clear any existing timeouts (enter or leave)
      clearHoverTimeout();
      // Set a new timeout to close the card
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 300);
      // Store the timeout ID in the ref
      hoverTimeoutRef.current = timeout;
    }
  };

  // Clean up any active timeout when the component unmounts
  useEffect(() => {
    // This cleanup function only accesses the ref, which is stable.
    // Therefore, the empty dependency array is correct and safe.
    return () => {
      clearHoverTimeout(); // Clears the timeout using the ref
    };
  }, []); // No dependencies needed as we only use the ref for cleanup

  return (
    // Use a wrapping div for the global mouse leave handler
    <div onMouseLeave={handleGlobalMouseLeave}>
      {/* Anchor element that triggers the hover card */}
      <div
        ref={anchorRef}
        onMouseEnter={handleMouseEnter}
        // Note: We don't strictly need onMouseLeave on the anchor itself
        // if handleGlobalMouseLeave covers the scenario correctly.
        // Kept for clarity, but handleGlobalMouseLeave is the primary exit handler.
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {/* The Popper component displaying the hover card */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        transition
        sx={{ zIndex: 9999 }} // Ensure card appears above other elements
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            {/* Ref for the card itself to manage hover state between trigger and card */}
            <div
              ref={cardRef}
              // Keep card open if mouse enters it from the trigger
              onMouseEnter={clearHoverTimeout} // Clear any pending close timeout
              // Rely on the outer div's onMouseLeave (handleGlobalMouseLeave)
              // to handle closing when moving out of the card.
              // onMouseLeave={handleMouseLeave} // This could potentially be used too
            >
              <Card
                sx={{ width: 350, height: 192, boxShadow: 5 }}
                // Attaching handlers directly to Card might be redundant
                // if the wrapping div handles it, but ensures capture.
                onMouseEnter={clearHoverTimeout}
              >
                <CardContent>
                  {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress />
                    </div>
                  ) : error ? (
                    <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>
                  ) : profile ? (
                    <UserHoverCardContent profile={profile} onFollowClick={handleFollow} />
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}