import { Skeleton } from '@heroui/skeleton';

export function ProfileSkeleton() {
  return (
    <>
      <Skeleton className="w-full h-[600px] rounded-2xl" />
      <Skeleton className="w-full h-[600px] rounded-2xl" />
    </>
  );
}
