// reportReasonsConfig.ts
export type ReportType = "profile" | "page" | "post" | "comment" | "message";

const defaultReasons = [
  "Inappropriate content",
  "Harassment",
  "Spam",
  "Misinformation",
  "Other",
];

export const reportReasonsConfig: Record<ReportType, string[]> = {
  profile: ["Fake account", "Impersonation", ...defaultReasons],
  page: ["Fraudulent organization", "Misleading content", ...defaultReasons],
  post: ["Copyright violation", "Violent content", "Hate speech", ...defaultReasons],
  comment: ["Hate speech", "Bullying", ...defaultReasons],
  message: ["Unwanted contact", "Phishing attempt", ...defaultReasons],
};