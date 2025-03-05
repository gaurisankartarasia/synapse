// // src/app/(auth)/signin/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { useDispatch, useSelector } from 'react-redux';
// import { AppDispatch, RootState } from '@/redux/store';
// import { signInWithEmail } from '@/redux/features/authSlice';
// import GoogleSignInButton from './GoogleSignInButton';
// import {Spinner} from '@/components/ui/spinner'
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardTitle, CardHeader, CardFooter, CardDescription } from '@/components/ui/card';
// import { useToast } from "@/hooks/use-toast";

// export default function SignIn() {
//   const router = useRouter();
//   const { toast } = useToast();

//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => state.auth);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const resultAction = await dispatch(signInWithEmail({ email, password }));
//     if (signInWithEmail.fulfilled.match(resultAction)) {
//       const { hasUsername } = resultAction.payload;
//       toast({
//         description: "Signed in successfully!",
//       });
//       router.push(hasUsername ? '/' : '/username');

//       // window.location.href = hasUsername ? '/' : '/username';
//     }
//   } catch (err) {
//     console.error('Sign in failed:', err);
//   }
// };

//   return (
//     <main>

//     <div className="min-h-screen flex items-center justify-center ">

//       <Card className="max-w-md w-full space-y-8 ">
//         <CardHeader>
//         <CardTitle>Sign In</CardTitle>
//         </CardHeader>
//         <CardContent>
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             {error}
//           </div>
//         )}

//         <div className="space-y-6">

//             <GoogleSignInButton />

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t " />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 ">Or continue with</span>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium ">
//               Email
//             </label>
//             <Input
//               id="email"
//               type="email"
//               required
//               className="mt-1 block w-full p-2"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium ">
//               Password
//             </label>
//             <Input
//               id="password"
//               type="password"
//               required
//               className="mt-1 block w-full border p-2"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-2 px-4 "
//           >
//             {loading ? <Spinner size={25}/> : 'Sign In'}
//           </Button>
//         </form>
//         <Link href="/forgot-password" className="underline float-end m-3">
//     Forgot Password?
//   </Link>
//         </CardContent>
//         <CardFooter>
//         <CardDescription>
//           Don't have an account?{' '}
//           <Link href="/signup" className="underline">
//             Sign up
//           </Link>
//         </CardDescription></CardFooter>
//       </Card>
//     </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signInWithEmail } from "@/redux/features/authSlice";
import GoogleSignInButton from "./GoogleSignInButton";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { toast } from "sonner";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignIn() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signInWithEmail({ email, password }));
      if (signInWithEmail.fulfilled.match(resultAction)) {
        toast.success("Sign in successful", {
          cancel: {
            label: "Ok",
            onClick: () => console.log("Ok"),
          },
        });

        router.push("/");
      } else {
        toast.error("Incorrect email or password", {
          cancel: {
            label: "Ok",
            onClick: () => console.log("Ok"),
          },
        });
      }
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <main>
      <div className=" ">
        <Image
        src='/vercel.svg'     
        width={100}
        height={100}
        alt="signin"
        />
        <div className="max-w-md w-full space-y-8">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <ErrorOutlineOutlinedIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <GoogleSignInButton />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                  {/* <span className="px-2">Or continue with</span> */}
                  <Separator title="OR"/>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full p-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="mt-1 block w-full border p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4"
              >
                {loading ? <Spinner size={25} color="white" /> : "Sign In"}
              </Button>
            </form>
            <Link href="/forgot-password" className="underline float-end m-3">
              Forgot Password?
            </Link>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Don't have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </CardDescription>
          </CardFooter>
        </div>
      </div>
    </main>
  );
}
