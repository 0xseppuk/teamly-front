'use client';

import { Pagination } from '@heroui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface ClientPaginationProps {
  total: number;
  perPage?: number;
}

export function ClientPagination({
  total,
  perPage = 12,
}: ClientPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil(total / perPage);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set('page', String(page));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8 flex ">
      <Pagination
        showControls
        color="secondary"
        page={currentPage}
        total={totalPages}
        onChange={handlePageChange}
      />
    </div>
  );
}
