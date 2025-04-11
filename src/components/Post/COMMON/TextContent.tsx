// components/TextContent.tsx
"use client";
import React from "react";
import Link from "next/link";

interface TextWithMentionsProps {
  content: string;
}

const TextContent: React.FC<TextWithMentionsProps> = ({ content }) => {
  if (!content) return null;

  const mentionRegex = /@([a-zA-Z0-9_\.]+)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`}>
          {content.substring(lastIndex, match.index)}
        </span>
      );
    }

    const username = match[1];
    elements.push(
      <Link
        href={`/${username}`}
        key={`mention-${match.index}`}
        className="text-blue-500 hover:underline font-medium"
      >
        @{username}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    elements.push(
      <span key={`text-${lastIndex}`}>
        {content.substring(lastIndex)}
      </span>
    );
  }

  return <>{elements}</>;
};

export default TextContent;