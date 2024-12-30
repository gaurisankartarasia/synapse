// // src/utils/formatDate.ts
// export function formatDate(dateString: string): string {
//     const date = new Date(dateString);
  
//     return new Intl.DateTimeFormat('en-US', {
//       day: 'numeric',
//       month: 'long',
//       year: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric',
//       hour12: true,
//       timeZoneName: 'short',
//     }).format(date);
//   }
  



// // Utility to format date with local time and timezone
export function getFormattedDate(): string {
  const date = new Date();
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZoneName: "short", // Includes timezone abbreviation
  }).format(date);
}



// utils/dateFormat.ts
interface TimeStamp {
  seconds: number;
  nanoseconds: number;
}

export const formatDate = (timestamp: TimeStamp) => {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};