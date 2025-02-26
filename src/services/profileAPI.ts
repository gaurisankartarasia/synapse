// src/services/api.ts
interface UserProfile {
    username: string;
    displayName: string;
    profilePhotoURL: string;
  }

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/my_profile/query');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch profile');
  }
  
  const data = await response.json();
  return data.user;
}


