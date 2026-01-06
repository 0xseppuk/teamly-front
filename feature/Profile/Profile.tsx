'use client';

import { ProfileIcon } from '@/components/icons';
import { useGetCountries } from '@/shared/services/country/country.hook';
import { useUpdateProfile } from '@/shared/services/profiles/profiles.hooks';
import { User } from '@/shared/types';
import { Card, CardBody } from '@heroui/card';
import { addToast } from '@heroui/toast';
import { useState } from 'react';
import { AddApplication } from '../GameApplication/AddApplication';
import { ProfileForm } from './Form/Form';
import { ProfileFormData } from './Form/profile.validation.schema';
import { ProfileHeader } from './ui';
import { ProfileSkeleton } from './ui/Skeleton';

interface ProfileProps {
  user: User;
  isOwnProfile?: boolean;
  isLoading?: boolean;
  onEdit?: () => void;
}

export function Profile({
  user,
  isOwnProfile = false,
  onEdit,
  isLoading,
}: ProfileProps) {
  if (!user) {
    return null;
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const [formDisabled, setFormDisabled] = useState<boolean>(true);

  const { data: countries } = useGetCountries();
  const { mutate: updateProfile } = useUpdateProfile({
    onSuccess: (data) => {
      addToast({
        title: 'Обновление профиля',
        description: 'Профиль обновлен успешно!',
        color: 'success',
        icon: <ProfileIcon />,
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
    id: String(user.id),
  });

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
          nickname={user.nickname}
          avatar={user.avatar_url}
          likes={user.likes_count}
          dislikes={user.dislikes_count}
          onClick={toggleEditMode}
        />
        <CardBody>
          <ProfileForm
            defaultValues={{
              discord: user.discord,
              telegram: user.telegram,
              country_code: user.country_code,
              gender: user.gender as 'male' | 'female',
              birth_date: user.birth_date,
              description: user.description,
              languages: user.languages,
            }}
            onSubmit={(data) => onSubmitProfile(data)}
            isEditing={formDisabled}
            countries={countries?.countries}
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
