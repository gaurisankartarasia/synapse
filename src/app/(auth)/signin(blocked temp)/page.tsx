
// src/app/signin/page.tsx
"use client";
import React, { useState } from "react";
import { auth, googleProvider } from "../../../lib/firebaseClient";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import {Button} from '@mui/material'

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showbutton, setShowbutton] = useState(true);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const router = useRouter();
  const title = "Remember";
  const description = "When you use Google to log in, you're not giving us access to all your data. You're simply allowing us to verify your identity using information they provide, like your name and profile picture. This helps us authenticate you quickly and easily.";

  const handleGoogleSignIn = async () => {
   
    try {
      setIsLoading(true);
      setError(null);
     
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      const response = await fetch("/api/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const userData = await response.json();

      if (!userData.username) {
        router.push("/username");
      } else {
        router.push("/");
      }

      setShowbutton(false);
      setLoginMessage("Login success!");
    } catch (err: any) {
      console.error("Failed to sign in with Google", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="container mx-auto min-h-screen flex justify-center items-center">
        <div>
          <div className="p-5">
            <h2 className="font-semibold text-xl text-center">Sign In</h2>

            {/* {error && (
  <Alert 
    title="Error ocurred"
    description={`${error}`} 
  />
)} */}
            {/* {loginMessage && 
              <Alert 
    color="success" 
    title={`${loginMessage}`}
    description="Redirecting..." 
  />
  } */}
            
            <div className="mx-auto m-1 p-1 flex justify-center">
            {isLoading && 'loadiing...'}
            </div>
            {showbutton && !isLoading && (
              <>
                <div   className="flex items-center justify-center m-5">
                  <Button
                    onClick={handleGoogleSignIn}
                  >
                    <FaGoogle className="mr-2" />
                    Sign in with Google
                  </Button>
                </div>
                <div className="mt-4 max-w-[500px]">
                  {/* <Alert
                    color="success"
                    description={description}
                    title={title}
                    variant="flat"
                  /> */}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;

