import { Skeleton } from '@heroui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="flex gap-10 flex-col sm:flex-row">
      <Skeleton className="w-full h-[600px] rounded-2xl"></Skeleton>
      <Skeleton className="w-full h-[600px] rounded-2xl"></Skeleton>
    </div>
  );
}
