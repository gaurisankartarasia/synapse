
// export interface User {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isVerified: boolean;
//   isFollowing: boolean;
//   isRequested?: boolean;
// }




export interface User {
  uid: string;
  username: string;
  email: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified: boolean;
  isFollowing: boolean;
  isRequested?: boolean;
  isPrivate?: boolean;
}

export interface FollowStatus {
  isFollowing: boolean;
  isRequested: boolean;
  followerCount: number;
  loading?: boolean;
}

export interface FollowState {
  followStatus: {
    [key: string]: FollowStatus;
  };
}