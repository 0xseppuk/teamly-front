'use client';

import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/dropdown';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { useGetUserApplications } from '@/shared/services/applications';

export function NotificationBell() {
  const router = useRouter();
  const { data } = useGetUserApplications();

  const totalPendingResponses = useMemo(() => {
    if (!data?.applications) return 0;

    return data.applications.reduce(
      (sum, app) => sum + (app.pending_responses_count || 0),
      0,
    );
  }, [data?.applications]);

  const applicationsWithResponses = useMemo(() => {
    if (!data?.applications) return [];

    return data.applications.filter(
      (app) => app.pending_responses_count && app.pending_responses_count > 0,
    );
  }, [data?.applications]);

  const handleViewResponses = (applicationId: string) => {
    router.push(`/profile?openResponses=${applicationId}`);
  };

  if (totalPendingResponses === 0) {
    return (
      <Button isIconOnly size="sm" variant="light">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <Badge color="danger" content={totalPendingResponses} shape="circle">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Badge>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Уведомления" variant="flat">
        <DropdownSection showDivider title="Новые отклики">
          {applicationsWithResponses.map((app) => (
            <DropdownItem
              key={app.id}
              description={`${app.pending_responses_count} новых откликов`}
              startContent="💬"
              onPress={() => handleViewResponses(app.id)}
            >
              {app.title}
            </DropdownItem>
          ))}
        </DropdownSection>
        <DropdownSection title="Действия">
          <DropdownItem
            key="view-all"
            className="text-primary"
            onPress={() => router.push('/profile')}
          >
            Перейти в профиль
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
