import { Card, CardBody, CardFooter, CardHeader } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

export function ApplicationsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-3 md:p-4">
          <CardHeader className="flex gap-2 md:gap-3">
            <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg md:h-12 md:w-12" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-20 rounded-lg" />
              <Skeleton className="h-4 w-32 rounded-lg" />
            </div>
          </CardHeader>
          <CardBody>
            <Skeleton className="mb-3 h-10 w-full rounded-lg" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
          </CardBody>
          <CardFooter>
            <Skeleton className="h-8 w-32 rounded-lg" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
