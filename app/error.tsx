'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { useEffect } from 'react';

import { LightBulbIcon } from '@/components/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {}, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-2 border-danger-300 bg-danger-50/50">
        <CardBody className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="rounded-full bg-danger-100 p-4">
            <LightBulbIcon className="h-12 w-12 text-danger-400" />
          </div>
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-semibold">Что-то пошло не так</h3>
            <p className="text-sm text-default-600">
              Не удалось загрузить список игр. Попробуйте обновить страницу.
            </p>
          </div>
          <Button color="primary" onPress={reset}>
            Попробовать снова
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
