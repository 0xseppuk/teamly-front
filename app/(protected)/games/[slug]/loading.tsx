import { ApplicationsSkeleton } from '@/feature/Applications/ui';

export default function Loading() {
  return (
    <div className="container mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-default-200" />
        <div className="mt-3 h-5 w-56 animate-pulse rounded-lg bg-default-200" />
      </div>
      <div className="mb-6 h-14 animate-pulse rounded-lg bg-default-200" />
      <ApplicationsSkeleton />
    </div>
  );
}
