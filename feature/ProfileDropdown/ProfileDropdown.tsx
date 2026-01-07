'use client';

import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { useRouter } from 'next/navigation';

import { routes, useGetMe, useLogout } from '@/shared';

export const ProfileDropdown = () => {
  const router = useRouter();
  const { data: me, isLoading, error } = useGetMe();

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      // Force full page reload to refresh server components and clear state
      window.location.href = routes.login;
    },
    onError: (error) => {
      console.error('Logout error:', error);
      // Even on error, try to redirect
      window.location.href = routes.login;
    },
  });

  if (isLoading) {
    return null; // Don't show anything while loading
  }

  if (!me?.user) {
    return (
      <Button
        color="secondary"
        size="sm"
        variant="flat"
        onPress={() => router.push('/login')}
      >
        Войти
      </Button>
    );
  }

  const handleLogout = () => {
    logout();
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
