'use client';

import { Avatar } from '@heroui/avatar';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { useRouter } from 'next/navigation';

import { routes, useGetMe } from '@/shared';

export const ProfileDropdown = () => {
  const router = useRouter();
  const { data: me, isLoading } = useGetMe();

  if (isLoading) {
    return null;
  }

  if (!me?.user) {
    return null;
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');
    // Redirect to login
    window.location.href = routes.login;
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          showFallback
          as="button"
          className="transition-transform"
          name={me?.user.nickname}
          src={me?.user.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
          <p className="font-semibold">Вы вошли как</p>
          <p className="font-semibold">
            {me?.user?.nickname || me?.user?.email}
          </p>
        </DropdownItem>
        <DropdownItem
          key="my-profile"
          textValue="My Profile"
          onPress={() => router.push('/profile')}
        >
          Мой профиль
        </DropdownItem>
        <DropdownItem
          key="my-applications"
          textValue="My Applications"
          onPress={() => router.push('/applications')}
        >
          Мои заявки
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          textValue="Logout"
          onPress={handleLogout}
        >
          Выйти
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
