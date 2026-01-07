import { Card } from '@heroui/card';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { UserApplicationsList } from '@/feature/GameApplication/UserApplicationsList';
import { Profile as ProfileWidget } from '@/feature/Profile/Profile';
import { getUserByIdServer } from '@/shared/services/users/server/users.server';

interface UserProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: UserProfilePageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { user } = await getUserByIdServer(id);

    return {
      title: `${user.nickname} | Teamly`,
      description: `Профиль пользователя ${user.nickname}`,
    };
  } catch {
    return {
      title: 'Пользователь не найден | Teamly',
    };
  }
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;

  try {
    const { user, applications } = await getUserByIdServer(id);

    return (
      <div className="flex gap-10 flex-col sm:flex-row">
        <ProfileWidget isOwnProfile={false} user={user} />
        <Card
          className="w-full overflow-y-auto p-10"
          style={{ maxHeight: '600px' }}
        >
          <UserApplicationsList applications={applications} />
        </Card>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
