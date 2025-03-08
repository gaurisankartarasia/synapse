
export interface LikeUser {
  uid: string;
  username: string;
  profilePhotoURL: string;
   timestamp: {
    _seconds:number;
    _nanoseconds:number
  };
}

export interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export interface LikeUserResponse {
  uid: string;
  username: string;
  profilePhotoURL: string;
  timestamp: {
    _seconds:number;
    _nanoseconds:number
  };
}


// export interface LikeUserResponse {
//   uid: string;
//   username: string;
//   profilePhotoURL: string;
//   timestamp: {
//     _seconds: number;
//     _nanoseconds: number;
//   };
//   isFollowing: boolean;
//   isRequested: boolean;
//   isFollowingWithoutFollowback: boolean;
//   followerCount: number;
// }