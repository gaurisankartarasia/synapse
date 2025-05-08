"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, signOut } from "@/lib/firebaseClient";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";

const SignOutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const signout = async () => {
      try {
        await signOut(auth);
        const res = await fetch("/api/v1/auth/signout", {
          method: "POST",
        });

        if (res.ok) {
          window.location.href = "/signin";
          router.replace("/signin");
        }
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

    signout();
  }, [router]);

  return (
    <section className="flex items-center justify-center  lg:mr-68 sm:mr-0">
      <div>
        <Image
          src="/assets/signout.svg"
          alt="Logo"
          width={500}
         height={500}
          className="mb-4"
        />
        <div className="flex items-center justify-center">
          {" "}
          <CircularProgress />
        </div>

        <p className="text-center">Signing out...</p>
      </div>
    </section>
  );
};

export default SignOutPage;
