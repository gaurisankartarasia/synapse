interface ReplyPreviewProps {
    replyTo: {
      content: string;
    };
  }
  
  export default function ReplyPreview({ replyTo }: ReplyPreviewProps) {
    return (
      <div className="ml-4 pl-2 border-l-2 border-gray-300 mb-2 flex flex-col">
        <span className="text-xs text-gray-500">Replying to:</span>
        <p className="text-sm text-gray-600">{replyTo.content}</p>
      </div>
    );
  }