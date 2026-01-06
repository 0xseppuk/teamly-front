import { Skeleton } from '@heroui/skeleton';

export default function Loading() {
  return (
    <section className="container mx-auto px-4 py-8">
      <Skeleton className="mb-6 h-12 w-64 rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    </section>
  );
}
