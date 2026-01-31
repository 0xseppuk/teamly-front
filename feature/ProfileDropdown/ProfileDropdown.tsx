'use client';

import { Avatar } from '@heroui/avatar';
import { Badge } from '@heroui/badge';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/dropdown';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { routes, useGetMe, useLogout } from '@/shared';
import { useGetUserApplications } from '@/shared/services/applications';
import { useGetUnreadCount } from '@/shared/services/conversations';

export const ProfileDropdown = () => {
  const router = useRouter();
  const { data: me, isLoading } = useGetMe();
  const { data } = useGetUserApplications(!!me?.user);
  const { data: unreadData } = useGetUnreadCount(!!me?.user);

  const { mutate: logoutMutation } = useLogout({
    onSuccess: () => {
      window.location.href = routes.login;
    },
    onError: () => {
      // Даже при ошибке перенаправляем на логин
      window.location.href = routes.login;
    },
  });

  const totalPendingResponses = useMemo(() => {
    if (!data?.applications) return 0;

    return data.applications.reduce(
      (sum, app) => sum + (app.pending_responses_count || 0),
      0,
    );
  }, [data?.applications]);

  const unreadMessagesCount = unreadData?.unread_count || 0;
  const totalBadgeCount = totalPendingResponses + unreadMessagesCount;

  if (isLoading) {
    return null;
  }

  if (!me?.user) {
    return null;
  }

  const handleLogout = () => {
    // Вызываем API logout - сервер удалит HTTP-only cookie
    logoutMutation();
  };

  return (
    <Dropdown placement="bottom-end">
      <Badge
        classNames={{
          badge: 'text-[10px] min-w-4 h-4 sm:text-xs sm:min-w-5 sm:h-5',
        }}
        color="danger"
        content={totalBadgeCount}
        isInvisible={totalBadgeCount === 0}
        shape="circle"
        showOutline={false}
        size="sm"
      >
        <DropdownTrigger>
          <Avatar
            isBordered
            showFallback
            as="button"
            className="transition-transform w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
            name={me?.user.nickname}
            src={me?.user.avatar_url}
          />
        </DropdownTrigger>
      </Badge>
      <DropdownMenu
        aria-label="Profile Actions"
        className="min-w-[200px] sm:min-w-[240px]"
        variant="flat"
      >
        <DropdownItem
          key="profile"
          className="h-12 sm:h-14 gap-1 sm:gap-2"
          textValue="Profile"
        >
          <p className="font-semibold text-xs sm:text-sm">Вы вошли как</p>
          <p className="font-semibold text-xs sm:text-sm truncate">
            {me?.user?.nickname || me?.user?.email}
          </p>
        </DropdownItem>
        <DropdownItem
          key="my-profile"
          className="py-2"
          textValue="My Profile"
          onPress={() => router.push('/profile')}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm sm:text-base">Мой профиль</span>
            {totalPendingResponses > 0 && (
              <span className="ml-2 bg-danger text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full min-w-[18px] sm:min-w-[20px] text-center">
                {totalPendingResponses}
              </span>
            )}
          </div>
        </DropdownItem>
        <DropdownItem
          key="chat"
          className="py-2"
          textValue="Chat"
          onPress={() => router.push('/chat')}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm sm:text-base">Сообщения</span>
            {unreadMessagesCount > 0 && (
              <span className="ml-2 bg-secondary text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full min-w-[18px] sm:min-w-[20px] text-center">
                {unreadMessagesCount > 99 ? '99+' : unreadMessagesCount}
              </span>
            )}
          </div>
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="py-2"
          color="danger"
          textValue="Logout"
          onPress={handleLogout}
        >
          <span className="text-sm sm:text-base">Выйти</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
