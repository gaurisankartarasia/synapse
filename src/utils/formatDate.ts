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



export const formatDateF = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};