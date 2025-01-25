/**
 * Type definition for serialized Firestore Timestamp
 * This matches the structure of the timestamp when it comes from an API response
 */
interface SerializedTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

/**
 * Formats a serialized timestamp to date string in format "01 January, 2025"
 * @param timestamp - Serialized timestamp or null
 * @returns Formatted date string or empty string if timestamp is null
 */
export const formatFullDate = (timestamp: SerializedTimestamp | null): string => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp._seconds * 1000);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a serialized timestamp to relative time (e.g. "1min ago") 
 * or full date for older dates
 * @param timestamp - Serialized timestamp or null
 * @returns Formatted relative time or date string
 */
export const formatRelativeTime = (timestamp: SerializedTimestamp | null): string => {
  if (!timestamp) return '';
  
  const now = new Date();
  const date = new Date(timestamp._seconds * 1000);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}min ago`;
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}day${days > 1 ? 's' : ''} ago`;
  }
  
  // Less than 4 weeks
  if (diffInSeconds < 2419200) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}week${weeks > 1 ? 's' : ''} ago`;
  }
  
  // Default to full date format for older dates
  return formatFullDate(timestamp);
};







// utils/date.ts
export function formatRelativeTime2(date: Date): string {
  const now = new Date('2025-01-23T18:59:15Z'); // Using the provided current time
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}