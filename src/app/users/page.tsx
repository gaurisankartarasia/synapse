

  "use client"; 

  import React, { useState, useEffect, useCallback } from 'react';
  import { auth } from '../../lib/firebaseClient'; 
  import { onAuthStateChanged } from 'firebase/auth';
  import { useParams, useRouter } from "next/navigation"; 
  import { VscVerifiedFilled } from "react-icons/vsc";
import {Card, Avatar} from '@mui/material'

  interface User {
    uid: string;
    username: string;
    displayName: string;
    photoURL: string;
    verified:string;
  }
  

  const UsersPage = () => {
    const params = useParams();
    const username = params?.username as string;
    const [users, setUsers] = useState<User[]>([]);
    const [token, setToken] = useState<string | null>(null);
   
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    // Listen for auth state changes and get the user's token
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const token = await user.getIdToken(); // Get the Firebase ID token
          setToken(token);
        } else {
          setToken(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    // Fetch users from API
    useEffect(() => {
      const fetchUsers = async () => {
        if (!token) return;

        try {
          const res = await fetch('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error('Failed to fetch users');

          const data = await res.json();
          setUsers(data.users);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      if (token) fetchUsers();
    }, [token]);


    const handleUserClick = async (uid: string) => {
      console.log("Fetching username for UID:", uid);
      try {
        const response = await fetch(`/api/get_username_from_uid?uid=${uid}`);
        const result = await response.json();
    
        if (response.ok && result.username) {
          console.log("Routing to username page:", result.username);
          router.push(`/${result.username}`);
        } else {
          console.error("Failed to fetch username:", result.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching username from uid:", error);
      }
    };
    
    
   
  

    if (loading) {
      return 'Loading...';
    }

    if (!token) {
      return <p>Please login first</p>;
    }

    return (
      <div>
        <h1>Suggested users</h1>
        <ul>
          {users.map((user) => (
            <li key={user.uid} className=" p-2 mx-2  bflex w-64"  >
              <Card className=''>
            <Avatar
              // src={user.photoURL || "/default.webp"}
              src={`/api/proxy?url=${encodeURIComponent(user.photoURL || '/default.webp')}`}

              alt={user.username}
            />
            
            <div>
              
              <p 
              onClick={() => handleUserClick(user.uid)}
              className="cursor-pointer hover:underline"
             >{user.username}</p>
             
              <p onClick={() => handleUserClick(user.uid)}>{user.displayName}</p>
            </div>
            {user.verified && <VscVerifiedFilled size={17} className="" />}
            </Card>
          </li>
          
          ))}
        </ul>

       
      </div>
    );
  };

  export default UsersPage;



