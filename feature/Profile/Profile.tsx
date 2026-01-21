'use client';

import { addToast } from '@heroui/toast';
import { useState } from 'react';

import { AddApplication } from '../GameApplication/AddApplication';
import { MyResponsesList } from '../MyResponses';

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

export function Profile({
  user,
  isLoading,
  isOwnProfile = false,
}: ProfileProps) {
  const [formDisabled, setFormDisabled] = useState<boolean>(true);

  const { data: countries } = useGetCountries();
  const { mutate: updateProfile } = useUpdateProfile({
    onSuccess: () => {
      addToast({
        title: 'Профиль обновлён',
        description: 'Изменения сохранены',
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
    if (!isOwnProfile) return;
    setFormDisabled(!formDisabled);
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    if (!isOwnProfile) return;
    setFormDisabled(true);
    updateProfile(data);
  };

  return (
    <div className={`grid gap-6 w-full ${isOwnProfile ? 'grid-cols-1 lg:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
      {/* Profile Card */}
      <div className={`relative rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl overflow-hidden ${isOwnProfile ? 'h-fit' : ''}`}>
        {/* Gradient accent */}
        <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

        <ProfileHeader
          avatar={user.avatar_url}
          isOwnProfile={isOwnProfile}
          nickname={user.nickname}
          userId={String(user.id)}
          onClick={toggleEditMode}
        />

        <div className="px-6 pb-6">
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
            isOwnProfile={isOwnProfile}
            onSubmit={(data) => onSubmitProfile(data)}
          />
        </div>
      </div>

      {isOwnProfile && (
        <>
          {/* Applications Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl overflow-hidden max-h-[600px]">
            <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="p-6 overflow-y-auto h-full">
              <AddApplication />
            </div>
          </div>

          {/* Responses Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl overflow-hidden lg:col-span-2 max-h-[600px]">
            <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="p-6 overflow-y-auto h-full">
              <MyResponsesList />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
