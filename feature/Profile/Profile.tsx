'use client';

import { Card, CardBody } from '@heroui/card';
import { addToast } from '@heroui/toast';
import { useState } from 'react';

import { AddApplication } from '../GameApplication/AddApplication';

import { ProfileForm } from './Form/Form';
import { ProfileFormData } from './Form/profile.validation.schema';
import { ProfileHeader } from './ui';
import { ProfileSkeleton } from './ui/Skeleton';

import { useGetCountries, useUpdateProfile } from '@/shared';
import { User } from '@/shared/types';

interface ProfileProps {
  user: User;
  isOwnProfile?: boolean;
  isLoading?: boolean;
  onEdit?: () => void;
}

export function Profile({ user, isLoading }: ProfileProps) {
  const [formDisabled, setFormDisabled] = useState<boolean>(true);

  const { data: countries } = useGetCountries();
  const { mutate: updateProfile } = useUpdateProfile({
    onSuccess: () => {
      addToast({
        title: 'Обновление профиля',
        description: 'Профиль обновлен успешно!',
        color: 'success',
      });
    },
    onError: () => {
      addToast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        color: 'danger',
      });
    },
    id: String(user.id),
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const toggleEditMode = () => {
    setFormDisabled(!formDisabled);
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    setFormDisabled(true);
    updateProfile(data);
  };

  return (
    <div className="flex gap-10 flex-col sm:flex-row">
      <Card className="w-full h-[600px] p-6">
        <ProfileHeader
          avatar={user.avatar_url}
          dislikes={user.dislikes_count}
          likes={user.likes_count}
          nickname={user.nickname}
          onClick={toggleEditMode}
        />
        <CardBody>
          <ProfileForm
            countries={countries?.countries}
            defaultValues={{
              discord: user.discord,
              telegram: user.telegram,
              country_code: user.country_code,
              gender: user.gender as 'male' | 'female',
              birth_date: user.birth_date,
              description: user.description,
              languages: user.languages,
            }}
            isEditing={formDisabled}
            onSubmit={(data) => onSubmitProfile(data)}
          />
        </CardBody>
      </Card>
      <Card
        className="w-full overflow-y-auto p-10"
        style={{ maxHeight: '600px' }}
      >
        <AddApplication />
      </Card>
    </div>
  );
}
