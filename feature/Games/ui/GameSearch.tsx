'use client';

import { Input } from '@heroui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';

export function GameSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialQuery = searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);

  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set('search', value.trim());
        params.delete('page'); // Reset page on new search
      } else {
        params.delete('search');
      }

      startTransition(() => {
        router.push(`/?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const handleChange = (value: string) => {
    setQuery(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      updateSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setQuery('');
    updateSearch('');
  };

  return (
    <div className="mb-6 max-w-md">
      <Input
        isClearable
        classNames={{
          inputWrapper:
            'bg-white/60 dark:bg-default-100/60 backdrop-blur-sm border border-white/30 dark:border-default-200/30',
        }}
        placeholder="Поиск игры..."
        startContent={
          <Search
            className={`text-default-400 ${isPending ? 'animate-pulse' : ''}`}
            size={18}
          />
        }
        value={query}
        onClear={handleClear}
        onValueChange={handleChange}
      />
    </div>
  );
}
