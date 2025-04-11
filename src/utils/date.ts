// /**
//  * Type definition for serialized Firestore Timestamp
//  * This matches the structure of the timestamp when it comes from an API response
//  */
// interface SerializedTimestamp {
//   _seconds: number;
//   _nanoseconds: number;
// }

// /**
//  * Formats a serialized timestamp to date string in format "01 January, 2025"
//  * @param timestamp - Serialized timestamp or null
//  * @returns Formatted date string or empty string if timestamp is null
//  */
// export const formatFullDate = (timestamp: SerializedTimestamp | null): string => {
//   if (!timestamp) return '';
  
//   const date = new Date(timestamp._seconds * 1000);
//   return date.toLocaleDateString('en-US', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
//   });
// };

// /**
//  * Formats a serialized timestamp to relative time (e.g. "1min ago") 
//  * or full date for older dates
//  * @param timestamp - Serialized timestamp or null
//  * @returns Formatted relative time or date string
//  */
// export const formatRelativeTime = (timestamp: SerializedTimestamp | null): string => {
//   if (!timestamp) return '';
  
//   const now = new Date();
//   const date = new Date(timestamp._seconds * 1000);
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
//   // Less than a minute
//   if (diffInSeconds < 60) {
//     return 'just now';
//   }
  
//   // Less than an hour
//   if (diffInSeconds < 3600) {
//     const minutes = Math.floor(diffInSeconds / 60);
//     return `${minutes}min ago`;
//   }
  
//   // Less than a day
//   if (diffInSeconds < 86400) {
//     const hours = Math.floor(diffInSeconds / 3600);
//     return `${hours}h ago`;
//   }
  
//   // Less than a week
//   if (diffInSeconds < 604800) {
//     const days = Math.floor(diffInSeconds / 86400);
//     return `${days}day${days > 1 ? 's' : ''} ago`;
//   }
  
//   // Less than 4 weeks
//   if (diffInSeconds < 2419200) {
//     const weeks = Math.floor(diffInSeconds / 604800);
//     return `${weeks}week${weeks > 1 ? 's' : ''} ago`;
//   }
  
//   // Default to full date format for older dates
//   return formatFullDate(timestamp);
// };







// // utils/date.ts
// export function formatRelativeTime2(date: Date): string {
//   const now = new Date('2025-01-23T18:59:15Z'); // Using the provided current time
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   if (diffInSeconds < 60) {
//     return 'just now';
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes}m ago`;
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return `${diffInHours}h ago`;
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) {
//     return `${diffInDays}d ago`;
//   }

//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// }






/**
 * Type definition for serialized Firestore Timestamp
 * This matches the structure of the timestamp when it comes from an API response
 */
interface SerializedTimestamp {
  _seconds: number;
  _nanoseconds: number; // Often unused for formatting but part of the type
}

/**
 * Formats a serialized timestamp to date string in format "01 January, 2025"
 * (Keeping this function as it might be used elsewhere)
 * @param timestamp - Serialized timestamp or null
 * @returns Formatted date string or empty string if timestamp is null
 */
export const formatFullDate = (timestamp: SerializedTimestamp | null): string => {
  if (!timestamp) return '';

  const date = new Date(timestamp._seconds * 1000);
  // Using en-GB locale as a common way to get DD Month, YYYY format, adjust if needed
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formats a serialized timestamp to relative time string based on specific rules:
 * - Today: "just now", "Xm ago", "Xh ago"
 * - Yesterday: "Yesterday, HH:MM" (24h)
 * - Day before yesterday: "[Weekday], HH:MM" (24h)
 * - Older: "Mon DD, YYYY" (e.g., Apr 1, 2025)
 * @param timestamp - Serialized timestamp or null
 * @returns Formatted relative time or date string
 */
export const formatRelativeTime = (timestamp: SerializedTimestamp | null): string => {
  if (!timestamp) return '';

  // --- Setup ---
  const now = new Date(); // Get current time
  const date = new Date(timestamp._seconds * 1000); // Convert input timestamp
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Get the start of the current day, yesterday, and the day before yesterday
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  const startOfDayBeforeYesterday = new Date(startOfToday);
  startOfDayBeforeYesterday.setDate(startOfToday.getDate() - 2);

  // --- Rule Implementation ---

  // 1. Check if the date is Today
  if (date >= startOfToday) {
    if (diffInSeconds < 60) {
      return 'just now';
    }
    if (diffInSeconds < 3600) { // Less than 1 hour
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m `;
    }
    // Must be hours ago on the same day
    const hours = Math.floor(diffInSeconds / 3600);
     // Should not exceed 23 hours if logic is correct, but safe check
    return `${hours}h `;
  }

  // 2. Check if the date is Yesterday
  if (date >= startOfYesterday && date < startOfToday) {
      // Use Intl.DateTimeFormat for reliable 24-hour time formatting
      const timeFormatter = new Intl.DateTimeFormat('en-IN', { // Using India locale from context
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Explicitly 24-hour format
      });
      return `Yesterday, ${timeFormatter.format(date)}`;
  }

  // 3. Check if the date is the Day Before Yesterday
  if (date >= startOfDayBeforeYesterday && date < startOfYesterday) {
      const timeFormatter = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const weekdayFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
      return `${weekdayFormatter.format(date)}, ${timeFormatter.format(date)}`;
  }

  // 4. Older than the day before yesterday - Use absolute date
  // Format: "Apr 5, 2025" (using en-US style month day, year) Adjust locale if needed.
  const dateFormatter = new Intl.DateTimeFormat('en-US', { // Changed locale for format example
      day: 'numeric',
      month: 'short',
      year: 'numeric'
  });
  return dateFormatter.format(date);
};

// Example Usage (assuming you have a timestamp object):
/*
const exampleTimestampPast = { _seconds: Math.floor(Date.now() / 1000) - 120 }; // 2 mins ago
const exampleTimestampYesterday = { _seconds: Math.floor(Date.now() / 1000) - 90000 }; // ~25 hours ago
const exampleTimestampOlder = { _seconds: Math.floor(Date.now() / 1000) - 5 * 86400 }; // 5 days ago

console.log(formatRelativeTime(exampleTimestampPast));      // Output: "2m ago" (approx)
console.log(formatRelativeTime(exampleTimestampYesterday)); // Output: "Yesterday, HH:MM" (approx)
console.log(formatRelativeTime(exampleTimestampOlder));     // Output: "Mar 31, 2025" (approx, based on current date April 5th)
*/

// You can remove formatRelativeTime2 if it's no longer needed
// export function formatRelativeTime2(date: Date): string { ... }