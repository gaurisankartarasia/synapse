
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Post } from "@/types/post";
// import { formatRelativeTime } from "@/utils/date";
// import Link from "next/link";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';


// export default function LikedPostsPage() {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchLikedPosts = async () => {
//       try {
//         const res = await fetch("/api/user/activity/likes");
//         if (!res.ok) throw new Error("Failed to fetch liked posts");

//         const data = await res.json();
//         setPosts(data.posts);
//       } catch (err) {
//         setError("Error loading liked posts.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLikedPosts();
//   }, []);

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Your Liked Posts</h1>
//       {posts.length === 0 ? (
//         <p className="text-center">You haven&apos;t liked any posts yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           {posts.map((post) => {
//             const imageUrl = post.imageURLs?.length ? post.imageURLs[0] : null;

//             return (
//               <div key={post.postId} className="border p-4 rounded shadow-sm">
//                 <Link href={`/post/${post.postId}`}>
//                 <p className="font-semibold">{post.username}</p>
                
//                 {imageUrl && (
//                   <Image
//                     src={imageUrl}
//                     width={500}
//                     height={500}
//                     alt="Post Image"
//                     className="object-cover rounded mt-2"
//                   />
//                 )}

//                 <p className=" mt-2">{post.content}</p>
//                 <p className="text-sm mt-2">
//                   <FavoriteIcon fontSize="small" /> {post.likeCount} | <AccessTimeOutlinedIcon  fontSize="small"/> {formatRelativeTime(post.createdAt)}
//                 </p></Link>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Post } from "@/types/post";
import Link from "next/link";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ImageIcon from '@mui/icons-material/Image';
import  {Spinner} from '@/components/ui/spinner';  

export default function LikedPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await fetch("/api/user/activity/likes");
        if (!res.ok) throw new Error("Failed to fetch liked posts");

        const data = await res.json();
        setPosts(data.posts);
      } catch (err) {
        setError("Error loading liked posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPosts();
  }, []);


  if (loading) return <div className="flex justify-center"><Spinner/></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (posts.length === 0) return <p className="text-center">No liked posts yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.map(post => (
        <div key={post.postId} className="shadow-md rounded-lg overflow-hidden">
          <Link href={`/post/${post.postId}`} className="overflow-hidden">
          <div className="relative group">
            {post.imageURLs && post.imageURLs.length > 0 && (
              <div className="relative aspect-square overflow-hidden">
                <Image 
                  src={post.imageURLs[0]} 
                  alt={`Post image`} 
                  fill 
                  className="object-cover rounded transition-opacity duration-300 group-hover:opacity-50" 
                  loading="eager" 
                  priority 
                />
                   {post.media_type === "image" && (
                    <div className="absolute top-2 right-2 text-white">
                        <ImageIcon  />
                    </div>
                )}
              
                <div className="absolute inset-0 flex items-center bg-black bg-opacity-30 justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-lg font-semibold  p-2 rounded flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      <FavoriteIcon fontSize='small' />
                      <span>{post.likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CommentOutlinedIcon fontSize='small'/>
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>
        </div>
      ))}
    </div>
  );
}
