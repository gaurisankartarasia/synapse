import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';

export const signOut = async () => {
    const auth = getAuth();

    try {
        await firebaseSignOut(auth);
        window.location.href = '/signin'; // Redirect to the sign-in page
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Sign out failed");
    }
};
