// src/hooks/useBlockUser.ts (or your preferred location)
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseBlockUserOptions {
  onSuccess?: () => void; // Optional callback for success
  onError?: (error: Error) => void; // Optional callback for error
}

export const useBlockUser = (targetUserId: string, options?: UseBlockUserOptions) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null); // Optional: track errors
  const router = useRouter();

  const handleBlock = async () => {
    // Reset error state on new attempt
    setError(null);

    // Confirmation dialog
    if (!window.confirm("Are you sure you want to block this user?")) {
      return; 
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/user/block/${targetUserId}`, {
        method: "POST",
        // You might want to add headers if needed, e.g., for authentication
        // headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        // Try to get error message from response body if possible
        let errorMsg = `Failed to block user. Status: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {
            // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMsg);
      }

      // Assuming the API call was successful
      setIsBlocked(true);
      options?.onSuccess?.(); // Call success callback if provided
      router.push("/settings/blocked"); // Redirect after successful block

    } catch (err) {
      const caughtError = err instanceof Error ? err : new Error(String(err));
      console.error("Error blocking user:", caughtError);
      setError(caughtError); // Store the error state
      options?.onError?.(caughtError); // Call error callback if provided
    } finally {
      setLoading(false);
    }
  };

  // Return the state and the function to trigger the block action
  return {
    isBlocked,
    loading,
    error, // Expose error state
    handleBlock, // Expose the function to initiate blocking
  };
};