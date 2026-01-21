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
      <div className="flex gap-6 flex-col lg:flex-row">
        <ProfileWidget isOwnProfile={false} user={user} />
        <div className="relative flex-1 rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl overflow-hidden max-h-[600px]">
          <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="p-6 overflow-y-auto h-full">
            <UserApplicationsList applications={applications} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
