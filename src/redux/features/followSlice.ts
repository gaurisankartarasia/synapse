
// features/followSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../lib/firebaseClient';

interface FollowState {
  followStatus: { 
    [key: string]: {
      isFollowing: boolean;
      isRequested: boolean;
      isFollowingWithoutFollowback:boolean;
      followerCount: number;
      loading?: boolean; // Add loading state per user
    };
  };
  error: string | null;
}

const initialState: FollowState = {
  followStatus: {},
  error: null,
};

export const toggleFollow = createAsyncThunk(
  'follow/toggleFollow',
  async (targetUsername: string, { rejectWithValue }) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/v1/follow-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUsername }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      const data = await response.json();
      return {
        targetUsername,
        status: data.status || (data.following ? 'Following' : 'Not following'),
        followerCount: data.followerCount,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    setFollowStatus: (state, action) => {
      const { username, isFollowing, isRequested, isFollowingWithoutFollowback, followerCount } = action.payload;
      state.followStatus[username] = {
        isFollowing,
        isRequested,
        isFollowingWithoutFollowback,
        followerCount,
        loading: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleFollow.pending, (state, action) => {
        const username = action.meta.arg;
        if (state.followStatus[username]) {
          state.followStatus[username].loading = true;
        } else {
          state.followStatus[username] = {
            isFollowing: false,
            isRequested: false,
            isFollowingWithoutFollowback:false,
            followerCount: 0,
            loading: true,
          };
        }
        state.error = null;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { targetUsername, status, followerCount } = action.payload;
        state.followStatus[targetUsername] = {
          isFollowing: status === 'Following',
          isRequested: status === 'Follow request sent',
          isFollowingWithoutFollowback: status === 'Follow back',
          followerCount,
          loading: false,
        };
      })
      .addCase(toggleFollow.rejected, (state, action) => {
        const username = action.meta.arg;
        if (state.followStatus[username]) {
          state.followStatus[username].loading = false;
        }
        state.error = action.payload as string;
      });
  },
});

export const { setFollowStatus } = followSlice.actions;
export default followSlice.reducer;