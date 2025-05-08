import { useState } from "react";

export function useReportUser() {
  const [isReporting, setIsReporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportUser = async (
    userId: string, 
    reason: string, 
    reportType: "profile" | "message" = "profile"
  ): Promise<boolean> => {
    try {
      setIsReporting(true);
      setError(null);
      
      const response = await fetch(`/api/v1/report/user_profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          reported_uid: userId,
          reason,
          report_type: reportType,
        }),
      });

      if (response.ok) {
        alert("Profile reported successfully");
        return true;
      } else {
        const data = await response.json();
        setError(data.error || "Failed to report profile");
        return false;
      }
    } catch (error) {
      console.error("Error reporting profile:", error);
      setError("Error submitting report");
      return false;
    } finally {
      setIsReporting(false);
    }
  };

  return { reportUser, isReporting, error };
}