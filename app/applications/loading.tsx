import { ApplicationsSkeleton } from '@/feature/Applications/ui';

/**
 * Loading UI for the applications page
 * Automatically shown during navigation and Suspense boundaries
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-4 flex items-center justify-between md:mb-8">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-default-200" />
      </div>
      <ApplicationsSkeleton />
    </div>
  );
}
