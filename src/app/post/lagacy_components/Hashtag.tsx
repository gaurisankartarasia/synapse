import Link from "next/link";

export const HashtagDisplay = ({ hashtags }: { hashtags?: string[] }) => {
    if (!hashtags || hashtags.length === 0) return null;

    return (
      <div className="flex gap-2 mt-2">
        {hashtags.map((tag, index) => (
          <Link
            key={index}
            href={`/hashtag/${tag.toLowerCase()}`}
            className="px-2 py-1 text-sm hover:underline"
          >
            #{tag}
          </Link>
        ))}
      </div>
    );
  };
