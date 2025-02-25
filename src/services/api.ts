// // src/services/api.ts
// interface UserProfile {
//     username: string;
//     displayName: string;
//     profilePhotoURL: string;
//   }

// export async function fetchUserProfile(): Promise<UserProfile> {
//   const response = await fetch('/api/user/my_profile/query');
  
//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Failed to fetch profile');
//   }
  
//   const data = await response.json();
//   return data.user;
// }




import axios from 'axios';

interface UserProfile {
  username: string;
  displayName: string;
  profilePhotoURL: string;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const axiosInstance = axios.create({
      baseURL: '/api',
      timeout: 5000,
      withCredentials: true,
    });

    const response = await axiosInstance.get('/user/my_profile/query');
    
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}
