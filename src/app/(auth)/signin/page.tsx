

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { signInWithEmail } from "@/redux/features/authSlice";
import GoogleSignInButton from "./GoogleSignInButton";
import {Spinner} from "@/components/ui/spinner"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CookieConsent from "@/components/CookiesDialog";

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
    <section>
      <div className=" flex justify-center lg:mr-64">
        

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
                <p className="px-2 text-center m-6">Or continue with</p>

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
                {loading ? <Spinner size={25}/> : "Sign In"}
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
    </section>
  );
}






