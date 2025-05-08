// // src/redux/features/postSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface PostState {
//   loading: boolean;
//   error: string | null;
//   imageURLs: string[];
//   isDirty: boolean;
// }

// const initialState: PostState = {
//   loading: false,
//   error: null,
//   imageURLs: [],
//   isDirty: false,
// };

// export const uploadPost = createAsyncThunk(
//   'post/uploadPost',
//   async ({ content, images, hashtags, allowCommenting, userToken }: {
//     content: string;
//     images: File[];
//     hashtags: string[];
//     allowCommenting: boolean;
//     userToken: string;
//   }) => {
//     const uploadedImageURLs = [];

//     // Upload each image
//     for (const image of images) {
//       const formData = new FormData();
//       formData.append("image", image);

//       const imageResponse = await fetch("/api/v1/post/upload_post_img", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${userToken}`,
//         },
//         body: formData,
//       });

//       if (!imageResponse.ok) {
//         throw new Error("Image upload failed");
//       }

//       const imageData = await imageResponse.json();
//       uploadedImageURLs.push(imageData.imageURL);
//     }

//     // Submit the post with all image URLs
//     const response = await fetch("/api/v1/post/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userToken}`,
//       },
//       body: JSON.stringify({
//         content,
//         imageURLs: uploadedImageURLs,
//         hashtags,
//         allowCommenting,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error);
//     }

//     return await response.json();
//   }
// );

// const postSlice = createSlice({
//   name: 'post',
//   initialState,
//   reducers: {
//     setDirty: (state, action) => {
//       state.isDirty = action.payload;
//     },
//     resetPostState: (state) => {
//       return initialState;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(uploadPost.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(uploadPost.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//         state.isDirty = false;
//       })
//       .addCase(uploadPost.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message ?? 'An error occurred';
//       });
//   },
// });

// export const { setDirty, resetPostState } = postSlice.actions;
// export default postSlice.reducer;







// src/redux/features/postSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PostState {
  loading: boolean;
  error: string | null;
  imageURLs: string[];
  isDirty: boolean;
}

const initialState: PostState = {
  loading: false,
  error: null,
  imageURLs: [],
  isDirty: false,
};

interface CreatePostPayload {
  content: string;
  imageURLs: string[];
  hashtags: string[];
  allowCommenting: boolean;
  uid: string;
}

export const createPost = createAsyncThunk(
  'post/createPost',
  async (payload: CreatePostPayload, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${payload.uid}`,
        },
        body: JSON.stringify({
          content: payload.content,
          imageURLs: payload.imageURLs,
          hashtags: payload.hashtags,
          allowCommenting: payload.allowCommenting,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setDirty: (state, action) => {
      state.isDirty = action.payload;
    },
    resetPostState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isDirty = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? 'An error occurred';
      });
  },
});

export const { setDirty, resetPostState } = postSlice.actions;
export default postSlice.reducer;