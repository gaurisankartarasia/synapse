import { Skeleton } from "@/components/ui/skeleton";

export function PostSkeleton() {
  return (
    <div className="p-4 rounded-md space-y-4 w-full ">
      {/* User Info */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 " />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      
      {/* Post Image */}
      <Skeleton className="h-96 w-full rounded-md" />
      
      {/* Engagement */}
      <div className="flex space-x-4">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
}
