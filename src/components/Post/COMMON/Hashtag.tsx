// import Link from "next/link";

// export const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
//     if (!hashtags || hashtags.length === 0) return null;

//     return (
//       <div className="flex gap-2 mt-2">
//         {hashtags.map((tag, index) => (
//           <Link
//             key={index}
//             href={`/hashtag/${tag.toLowerCase()}`}
//             className="px-2 py-1 text-sm hover:underline"
//           >
//             #{tag}
//           </Link>
//         ))}
//       </div>
//     );
//   };


import { Link,  Chip } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface HashtagDisplayProps {
  hashtags?: string[];
}

const chipStyle: SxProps<Theme> = {
  fontSize: (theme) => theme.typography.body2.fontSize,
  fontWeight: (theme) => theme.typography.fontWeightRegular,
  
  mr: 1,
  mb: 1,
};

export const HashtagDisplay: React.FC<HashtagDisplayProps> = ({ hashtags }) => {
  if (!hashtags || hashtags.length === 0) return null;

  return (
    <div className="mt-2">
      {hashtags.map((tag, index) => (
        <Link
          key={index}
          href={`/hashtag/${tag.toLowerCase()}`}
          style={{ textDecoration: "none" }}
        >
          <Chip label={`#${tag}`} size="small" sx={chipStyle} />
        </Link>
      ))}
    </div>
  );
};