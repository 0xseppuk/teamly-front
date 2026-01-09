'use client';

import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

import { Profile as ProfileWidget } from '@/feature/Profile/Profile';
import { useGetMe } from '@/shared/services/profiles/profiles.hooks';

export default function Profile() {
  const { data, isLoading, error } = useGetMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardBody className="text-center p-6">
            <p className="text-danger text-lg font-semibold">
              Ошибка загрузки профиля
            </p>
            <p className="text-default-500 mt-2">
              {error.message || 'Не удалось загрузить данные профиля'}
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardBody className="text-center p-6">
            <p className="text-warning text-lg font-semibold">
              Профиль не найден
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex gap-6 flex-col">
      <ProfileWidget isOwnProfile={true} user={data.user} />
    </div>
  );
}
