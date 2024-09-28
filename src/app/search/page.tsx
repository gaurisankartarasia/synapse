

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "../../lib/firebaseClient";
// import './Search.css';

// const SearchPage: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const handleSearch = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!searchTerm.trim()) return;

//     setLoading(true);
//     try {
//       const response = await fetch(`/api/search-users?q=${encodeURIComponent(searchTerm)}`);
//       const result = await response.json();

//       if (response.ok) {
//         setSearchResults(result.users || []);
//       } else {
//         console.error("Search failed:", result.error);
//       }
//     } catch (error) {
//       console.error("Error searching users:", error);
//     }
//     setLoading(false);
//   };

//   const handleProfileClick = async (username: string) => {
//     const currentUser = auth.currentUser;

//     if (currentUser && currentUser.displayName === username) {
//       router.push("/profile");
//     } else {
//       router.push(`/${username}`);
//     }
//   };

 
  

//   return (
//     <main className="main">
//       <h2 className="search_page_title">Search Users</h2>
//       <form className="search_form" onSubmit={handleSearch}>
//         <input
//           className="search_input"
//           type="text"
//           placeholder="Search by username"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button className="search_button" type="submit">Search</button>
//       </form>

//       {loading && <p className="loader"></p>}

//       {searchResults.length > 0 && (
//         <ul className="search_list">
//           {searchResults.map((user) => (
//             <li key={user.username} onClick={() => handleProfileClick(user.username)} className="cursor-pointer search_item">
//               <img src={user.photoURL || "/default-profile.png"} alt={user.username} width={50} height={50} />
//               <div className="search_item_data">
//                 <h1 className="search_username">@{user.username}</h1>
//                 <p className="search_displayName">{user.displayName || user.username}</p>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {searchResults.length === 0 && !loading && <p>No users found</p>}
//     </main>
//   );
// };

// export default SearchPage;








"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import LoaderSpinner from '../../components/Loader';
import './Search.css';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search-users?q=${encodeURIComponent(searchTerm)}`);
      const result = await response.json();

      if (response.ok) {
        setSearchResults(result.users || []);
      } else {
        console.error("Search failed:", result.error);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    }
    setLoading(false);
  };

  const handleProfileClick = async (uid: string) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const currentUid = currentUser.uid;

      if (currentUid === uid) {
        // If the clicked profile is the same as the current user, go to "/profile"
        router.push("/profile");
      } else {
        // Fetch username for the clicked uid and redirect
        try {
          const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
          const result = await response.json();

          if (response.ok && result.username) {
            router.push(`/${result.username}`);
          } else {
            console.error("Failed to fetch username:", result.error);
          }
        } catch (error) {
          console.error("Error fetching username from uid:", error);
        }
      }
    }
  };

  return (
    <main className="main">
      <h2 className="search_page_title">Search Users</h2>
      <form className="search_form" onSubmit={handleSearch}>
        <input
          className="search_input"
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search_button" type="submit">Search</button>
      </form>

      {loading && <LoaderSpinner size={20}/>}

      {searchResults.length > 0 && (
        <ul className="search_list">
          {searchResults.map((user) => (
            <li key={user.uid} onClick={() => handleProfileClick(user.uid)} className="cursor-pointer search_item">
              <img src={user.photoURL || "/default-profile.png"} alt={user.username} width={50} height={50} />
              <div className="search_item_data">
                <h1 className="search_username">@{user.username}</h1>
                <p className="search_displayName">{user.displayName || user.username}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {searchResults.length === 0 && !loading && <p>No users found</p>}
    </main>
  );
};

export default SearchPage;
