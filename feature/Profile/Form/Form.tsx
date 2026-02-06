import { Button } from '@heroui/button';
import { DateInput } from '@heroui/date-input';
import { Input, Textarea } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';

import {
  ProfileFormData,
  profileValidationSchema,
} from './profile.validation.schema';

import { Country } from '@/shared/types';
import { formatToISODate, parseISODate } from '@/shared/utils/date';

type ProfileFormProps = {
  defaultValues?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  isEditing?: boolean;
  countries?: Country[];
  isOwnProfile?: boolean;
};

const inputClassNames = {
  inputWrapper:
    'bg-white/5 border-white/10 hover:bg-white/10 group-data-[focus=true]:bg-white/10',
};

const selectClassNames = {
  trigger:
    'bg-white/5 border-white/10 hover:bg-white/10 data-[focus=true]:bg-white/10',
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  isEditing = false,
  countries,
  isOwnProfile = false,
}: ProfileFormProps) {
  const { register, handleSubmit, control } = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues,
  });

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          {...register('discord')}
          classNames={inputClassNames}
          isDisabled={isEditing}
          label="Discord"
          placeholder="username"
          variant="flat"
        />
        <Input
          {...register('telegram')}
          classNames={inputClassNames}
          isDisabled={isEditing}
          label="Telegram"
          placeholder="@username"
          variant="flat"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select
              classNames={selectClassNames}
              isDisabled={isEditing}
              label="Пол"
              placeholder="Выберите пол"
              selectedKeys={field.value ? [field.value] : []}
              variant="flat"
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            >
              <SelectItem key="male">Мужской</SelectItem>
              <SelectItem key="female">Женский</SelectItem>
            </Select>
          )}
        />
        <Controller
          control={control}
          name="birth_date"
          render={({ field }) => (
            <DateInput
              classNames={inputClassNames}
              isDisabled={isEditing}
              label="Дата рождения"
              value={parseISODate(field.value)}
              variant="flat"
              onChange={(date) => field.onChange(formatToISODate(date))}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="country_code"
        render={({ field }) => (
          <Select
            classNames={selectClassNames}
            isDisabled={isEditing}
            isLoading={!countries}
            label="Страна"
            placeholder="Выберите страну"
            selectedKeys={field.value ? [field.value] : []}
            variant="flat"
            onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
          >
            {countries?.map((country) => (
              <SelectItem
                key={country.code}
                startContent={<span className="text-lg">{country.flag}</span>}
              >
                {country.name_ru}
              </SelectItem>
            )) || []}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="languages"
        render={({ field }) => (
          <Select
            classNames={selectClassNames}
            isDisabled={isEditing}
            label="Языки"
            placeholder="Выберите языки"
            selectedKeys={field.value || []}
            selectionMode="multiple"
            variant="flat"
            onSelectionChange={(keys) => field.onChange(Array.from(keys))}
          >
            <SelectItem key="russian">Русский</SelectItem>
            <SelectItem key="english">Английский</SelectItem>
            <SelectItem key="kazahstan">Казахский</SelectItem>
          </Select>
        )}
      />

      <Textarea
        {...register('description')}
        classNames={inputClassNames}
        isDisabled={isEditing}
        label="О себе"
        maxRows={4}
        minRows={3}
        placeholder={
          isOwnProfile ? 'Расскажите о себе, своём игровом опыте...' : ''
        }
        variant="flat"
      />

      {isOwnProfile && (
        <Button
          className={clsx('w-full font-semibold', isEditing && 'hidden')}
          color="secondary"
          size="lg"
          onPress={() => handleSubmit(onSubmit)()}
        >
          Сохранить изменения
        </Button>
      )}
    </form>
  );
}
