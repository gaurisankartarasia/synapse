import Link from "next/link";

export const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
    if (!hashtags || hashtags.length === 0) return null;

    return (
      <div className="flex gap-2 mt-2">
        {hashtags.map((tag, index) => (
          <Link
            key={index}
            href={`/hashtag/${tag.toLowerCase()}`}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm hover:underline"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };
