
// // types/user.ts
// export interface User {
//   uid: string;
//   username: string;
//   displayName: string;
//   profilePhotoURL: string;
//   isVerified: boolean;
//   isFollowing: boolean;
// }



export interface User {
  uid: string;
  username: string;
  displayName: string;
  profilePhotoURL: string;
  isVerified: boolean;
  isFollowing: boolean;
  isRequested?: boolean;
}
