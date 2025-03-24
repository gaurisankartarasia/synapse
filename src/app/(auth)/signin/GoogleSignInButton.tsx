
// Updated src/components/GoogleSignInButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithGoogle } from '@/redux/features/authSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import  {Spinner}  from  "@/components/ui/spinner"
import { Button } from '@/components/ui/button';
import { toast } from "sonner"
import Image from 'next/image';


export default function GoogleSignInButton() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleGoogleSignIn = async () => {
    try {
      const resultAction = await dispatch(signInWithGoogle());
      if (signInWithGoogle.fulfilled.match(resultAction)) {
        toast.success("Sign in successful", {

          cancel: {
            label: "Ok",
            onClick: () => console.log("Ok"),
          },
        })
        router.push('/')
      }

      else {
        toast.error("Faild to sign in with Google", {

          cancel: {
            label: "Ok",
            onClick: () => console.log("Ok"),
          },
        })
      }

    } catch (err) {
      console.error('Google sign in failed:', err);
    }
  };




  return (
    <div className="space-y-2">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">

            <Spinner size={25} />
          </span>
        ) : (
          <>
          <Image
          src="https://firebasestorage.googleapis.com/v0/b/quixxle.appspot.com/o/assets%2FgoogleIcon.png?alt=media&token=627be043-9734-4414-986f-1a6c1bf25698"
          height={15}
          width={15}
          alt='google'
          />

            Continue with Google
          </>
        )}
      </Button>
      {/* {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )} */}
    </div>
  );
}
