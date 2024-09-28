
// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { auth } from "../../lib/firebaseClient"; // Assuming you have Firebase auth client setup
// import { RiVerifiedBadgeFill } from "react-icons/ri";
// import Modal from "../../components/Modal"; // Assuming Modal component is in your components folder
// import LoaderSpinner from "../../components/Loader"; // Assuming LoaderSpinner component is in your components folder
// import "./globals.css"; // Assuming your global styles are here

// const PublicProfilePage: React.FC = () => {
//   const params = useParams();
//   const username = params?.username as string;
//   const [user, setUser] = useState<any>(null);
//   const [authChecked, setAuthChecked] = useState<boolean>(false);
//   const [followStatus, setFollowStatus] = useState<string>(""); // "" | "requested" | "following"
//   const [followersCount, setFollowersCount] = useState<number>(0);
//   const [followingCount, setFollowingCount] = useState<number>(0);
//   const [isUpdating, setIsUpdating] = useState<boolean>(false);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [followersList, setFollowersList] = useState<any[]>([]);
//   const [followingList, setFollowingList] = useState<any[]>([]);
//   const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
//   const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const router = useRouter();

//   const fetchUserData = useCallback(async () => {
//     try {
//       const currentUser = await new Promise<any>((resolve, reject) => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//           unsubscribe();
//           if (user) {
//             resolve(user);
//           } else {
//             reject(new Error("Not authenticated"));
//           }
//         });
//       });

//       const token = await currentUser.getIdToken();

//       // Redirect if the current user is the same as the profile being viewed
//       if (currentUser.displayName === username) {
//         router.push("/profile");
//         return;
//       }

//       // Fetch user data from API
//       const userResponse = await fetch(`/api/user-profile-public?username=${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (userResponse.ok) {
//         const userData = await userResponse.json();
//         setUser(userData);

//         // Fetch follow data
//         const followResponse = await fetch(`/api/get-following-followers?username=${username}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (followResponse.ok) {
//           const followData = await followResponse.json();
//           setFollowersCount(followData.followersCount || 0);
//           setFollowingCount(followData.followingCount || 0);
//           setFollowStatus(followData.isFollowing ? "following" : followData.isRequested ? "requested" : "");
//         } else {
//           router.push("/search"); // If user is not found, redirect
//         }
//       } else {
//         router.push("/search"); // Redirect if user data fetch fails
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       router.push("/login"); // Redirect to login if auth fails
//     } finally {
//       setAuthChecked(true);
//       setLoading(false);
//     }
//   }, [username, router]);

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);

//   // Handle fetching followers
//   const handleFetchFollowers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = await auth.currentUser?.getIdToken();
//       const response = await fetch(`/api/get-followers?username=${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFollowersList(data.followers);
//         setErrorMessage("");
//       } else {
//         const error = await response.json();
//         setErrorMessage(error.error);
//       }
//     } catch (error) {
//       setErrorMessage("Failed to fetch followers");
//     } finally {
//       setLoading(false);
//     }
//   }, [username]);

//   // Handle fetching following
//   const handleFetchFollowing = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = await auth.currentUser?.getIdToken();
//       const response = await fetch(`/api/get-following?username=${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setFollowingList(data.following);
//         setErrorMessage("");
//       } else {
//         const error = await response.json();
//         setErrorMessage(error.error);
//       }
//     } catch (error) {
//       setErrorMessage("Failed to fetch following");
//     } finally {
//       setLoading(false);
//     }
//   }, [username]);

//   // Handle follow/unfollow
//   const handleFollow = useCallback(async () => {
//     if (!auth.currentUser || isUpdating) return;

//     const isFollowing = followStatus === "following";
//     const isRequesting = followStatus === "requested";

//     // Optimistic UI update
//     setIsUpdating(true);
//     setFollowStatus(isFollowing || isRequesting ? "" : "requested");

//     try {
//       const token = await auth.currentUser.getIdToken();
//       const response = await fetch("/api/follow-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ targetUsername: username }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "Unfollowed") {
//           setFollowStatus("");
//         } else if (data.status === "Follow request sent") {
//           setFollowStatus("requested");
//         } else if (data.following) {
//           setFollowStatus("following");
//         }

//         setFollowersCount(data.followersCount || followersCount);
//         setFollowingCount(data.followingCount || followingCount);
//       } else {
//         throw new Error("Failed to follow/unfollow user");
//       }
//     } catch (error) {
//       console.error("Follow action failed:", error);
//       setFollowStatus(isFollowing || isRequesting ? "following" : "");
//     } finally {
//       setIsUpdating(false);
//     }
//   }, [followStatus, followersCount, followingCount, isUpdating, username]);

//   if (loading) {
//     return <LoaderSpinner size={20} />;
//   }

//   if (!authChecked || !user) {
//     return <div className="error-message">Error loading profile.</div>;
//   }

//   return (
//     <main className="profile-container">
//       <img className="profile-pic" src={user.photoURL || "/default-profile.png"} alt={user.username} />
//       <h1 className="user-name">{user.displayName || user.username}</h1>
//       <div className="flex items-center">
//         <p className="username mr-1">@{user.username}</p>
//         {user.verified && <RiVerifiedBadgeFill size={17} className="text-blue-900" />}
//       </div>

//       {/* Followers count - no page reload */}
//       <div
//         className="followers "
//         onClick={(e) => {
//           e.preventDefault(); // Prevent default anchor behavior if any
//           if (followStatus === "following") {
//             setIsFollowersModalOpen(true);
//             handleFetchFollowers();
//           } else {
//             setErrorMessage("This user's followers list is private.");
//           }
//         }}
//       >
//         {followersCount} Followers
//       </div>

//       {/* Following count - no page reload */}
//       <div
//         className="following"
//         onClick={(e) => {
//           e.preventDefault(); // Prevent default anchor behavior if any
//           if (followStatus === "following") {
//             setIsFollowingModalOpen(true);
//             handleFetchFollowing();
//           } else {
//             setErrorMessage("This user's following list is private.");
//           }
//         }}
//       >
//         {followingCount} Following
//       </div>

//       <p>{user.bio}</p>

//       {user.private && followStatus !== "following" ? (
//         <p className="private-account">This account is private</p>
//       ) : followStatus === "following" ? (
//         <p className="private-account">You are following this account</p>
//       ) : (
//         <p className="public-account">This account is public</p>
//       )}

//       <button className="follow-button" onClick={handleFollow} disabled={isUpdating}>
//         {isUpdating
//           ? "Processing..."
//           : followStatus === "following"
//           ? "Following"
//           : followStatus === "requested"
//           ? "Requested"
//           : "Follow"}
//       </button>

//       {/* Modals for followers and following */}
//       <Modal isOpen={isFollowersModalOpen} onClose={() => setIsFollowersModalOpen(false)} title="Followers">
//         {loading ? (
//           <LoaderSpinner size={20} />
//         ) : (
//           <ul>
//             {followersList.map((follower) => (
//               <li key={follower.uid}>{follower.displayName || follower.username}</li>
//             ))}
//           </ul>
//         )}
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//       </Modal>

//       <Modal isOpen={isFollowingModalOpen} onClose={() => setIsFollowingModalOpen(false)} title="Following">
//         {loading ? (
//           <LoaderSpinner size={20} />
//         ) : (
//           <ul>
//             {followingList.map((following) => (
//               <li key={following.uid}>{following.displayName || following.username}</li>
//             ))}
//           </ul>
//         )}
//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//       </Modal>
//     </main>
//   );
// };

// export default PublicProfilePage;








"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient"; // Assuming you have Firebase auth client setup
import { RiVerifiedBadgeFill } from "react-icons/ri";
import Modal from "../../components/Modal"; // Assuming Modal component is in your components folder
import LoaderSpinner from "../../components/Loader"; // Assuming LoaderSpinner component is in your components folder
import "./globals.css"; // Assuming your global styles are here

const PublicProfilePage: React.FC = () => {
  const params = useParams();
  const username = params?.username as string;
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [followStatus, setFollowStatus] = useState<string>(""); // "" | "requested" | "following"
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);  // For chat modal

  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const currentUser = await new Promise<any>((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            resolve(user);
          } else {
            reject(new Error("Not authenticated"));
          }
        });
      });

      const token = await currentUser.getIdToken();

      // Redirect if the current user is the same as the profile being viewed
      if (currentUser.displayName === username) {
        router.push("/profile");
        return;
      }

      // Fetch user data from API
      const userResponse = await fetch(`/api/user-profile-public?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch follow data
        const followResponse = await fetch(`/api/get-following-followers?username=${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (followResponse.ok) {
          const followData = await followResponse.json();
          setFollowersCount(followData.followersCount || 0);
          setFollowingCount(followData.followingCount || 0);
          setFollowStatus(followData.isFollowing ? "following" : followData.isRequested ? "requested" : "");
        } else {
          router.push("/search"); // If user is not found, redirect
        }
      } else {
        router.push("/search"); // Redirect if user data fetch fails
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login"); // Redirect to login if auth fails
    } finally {
      setAuthChecked(true);
      setLoading(false);
    }
  }, [username, router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle fetching followers
  const handleFetchFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/get-followers?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFollowersList(data.followers);
        setErrorMessage("");
      } else {
        const error = await response.json();
        setErrorMessage(error.error);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch followers");
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Handle fetching following
  const handleFetchFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch(`/api/get-following?username=${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFollowingList(data.following);
        setErrorMessage("");
      } else {
        const error = await response.json();
        setErrorMessage(error.error);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch following");
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Handle follow/unfollow
  const handleFollow = useCallback(async () => {
    if (!auth.currentUser || isUpdating) return;

    const isFollowing = followStatus === "following";
    const isRequesting = followStatus === "requested";

    // Optimistic UI update
    setIsUpdating(true);
    setFollowStatus(isFollowing || isRequesting ? "" : "requested");

    try {
      const token = await auth.currentUser.getIdToken();
      const response = await fetch("/api/follow-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetUsername: username }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "Unfollowed") {
          setFollowStatus("");
        } else if (data.status === "Follow request sent") {
          setFollowStatus("requested");
        } else if (data.following) {
          setFollowStatus("following");
        }

        setFollowersCount(data.followersCount || followersCount);
        setFollowingCount(data.followingCount || followingCount);
      } else {
        throw new Error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Follow action failed:", error);
      setFollowStatus(isFollowing || isRequesting ? "following" : "");
    } finally {
      setIsUpdating(false);
    }
  }, [followStatus, followersCount, followingCount, isUpdating, username]);



  // chatting session here................
  const handleStartChat = async () => {
    if (!auth.currentUser) return;

    const token = await auth.currentUser.getIdToken();

    try {
      const response = await fetch("/api/start-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUsername: username }),
      });

      if (response.ok) {
        const { chatId } = await response.json();
        router.push(`/chat/${chatId}`);
      } else {
        console.error("Failed to start chat");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };
  const openChatModal = () => {
    setIsChatModalOpen(true);
  };

  const closeChatModal = () => {
    setIsChatModalOpen(false);
  };

  if (loading) {
    return <LoaderSpinner size={20} />;
  }

  if (!authChecked || !user) {
    return <div className="error-message">Error loading profile.</div>;
  }

  return (
    <main className="profile-container">
      <img className="profile-pic" src={user.photoURL || "/default-profile.png"} alt={user.username} />
      <h1 className="user-name">{user.displayName || user.username}</h1>
      <div className="flex items-center">
        <p className="username mr-1">@{user.username}</p>
        {user.verified && <RiVerifiedBadgeFill size={17} className="text-blue-900" />}
      </div>

      {/* Followers count - no page reload */}
      <div
        className="followers "
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior if any
          if (followStatus === "following") {
            setIsFollowersModalOpen(true);
            handleFetchFollowers();
          } else {
            setErrorMessage("This user's followers list is private.");
          }
        }}
      >
        {followersCount} Followers
      </div>

      {/* Following count - no page reload */}
      <div
        className="following"
        onClick={(e) => {
          e.preventDefault(); // Prevent default anchor behavior if any
          if (followStatus === "following") {
            setIsFollowingModalOpen(true);
            handleFetchFollowing();
          } else {
            setErrorMessage("This user's following list is private.");
          }
        }}
      >
        {followingCount} Following
      </div>

      <p>{user.bio}</p>

      {user.private && followStatus !== "following" ? (
        <p className="private-account">This account is private</p>
      ) : followStatus === "following" ? (
        <p className="private-account">You are following this account</p>
      ) : (
        <p className="public-account">This account is public</p>
      )}

      <button className="follow-button" onClick={handleFollow} disabled={isUpdating}>
        {isUpdating
          ? "Processing..."
          : followStatus === "following"
          ? "Following"
          : followStatus === "requested"
          ? "Requested"
          : "Follow"}
      </button>

      <button className="start-chat-button" onClick={handleStartChat}>
        Start Chat
      </button>

      {/* Modals for followers and following */}
      <Modal isOpen={isFollowersModalOpen} onClose={() => setIsFollowersModalOpen(false)} title="Followers">
        {loading ? (
          <LoaderSpinner size={20} />
        ) : (
          <ul>
            {followersList.map((follower) => (
              <li key={follower.uid}>{follower.displayName || follower.username}</li>
            ))}
          </ul>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </Modal>

      <Modal isOpen={isFollowingModalOpen} onClose={() => setIsFollowingModalOpen(false)} title="Following">
        {loading ? (
          <LoaderSpinner size={20} />
        ) : (
          <ul>
            {followingList.map((following) => (
              <li key={following.uid}>{following.displayName || following.username}</li>
            ))}
          </ul>
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </Modal>



    </main>
  );
};

export default PublicProfilePage;







