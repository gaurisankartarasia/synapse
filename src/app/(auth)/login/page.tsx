
// src/app/login/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../../../lib/firebaseClient";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import LoaderSpinner from '../../../components/Loader';
import { FaGoogle } from "react-icons/fa";
import './globals.css';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [showButton, setShowButton] = useState(true); 
  const [loginMessage, setLoginMessage] = useState<string | null>(null); 
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      
      setIsLoading(true); 
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      // Check if the user has a username set
      const response = await fetch("/api/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await response.json();
      if (!userData.username) {
        router.push("/username"); 
      } else {
        router.push("/profile"); 
      }

      setShowButton(false);
      setLoginMessage("Login success!");
      // window.location.reload(); 


    } catch (error) {
      console.error("Failed to sign in with Google", error);
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
  

<main>
<div className="container">
  <div className="login-form">
    <h2 className="form-title">Login</h2>
    {error && <p className="error-message" id="error-message">{error}</p>} 
    {loginMessage && <p className="text-blue-700">{loginMessage}</p>} 
    {isLoading && <LoaderSpinner size={20}/>} 
    {showButton && !isLoading && ( 
      <button className="google-btn flex items-center justify-center" onClick={handleGoogleSignIn}>
      <FaGoogle className="mr-2"/>
      Sign in with Google</button>
    )}
  </div>
</div>
</main>
    </>
  );
};

export default LoginPage;