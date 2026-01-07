import { Button } from '@heroui/button';
import { DateInput } from '@heroui/date-input';
import { Form } from '@heroui/form';
import { Input } from '@heroui/input';
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

export function ProfileForm({
  defaultValues,
  onSubmit,
  isEditing = false,
  countries,
  isOwnProfile = false,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileValidationSchema),
    defaultValues,
  });

  return (
    <Form className="gap-4 flex-col w-full">
      <div className="flex gap-4 w-full">
        <Input
          {...register('discord')}
          className="w-full"
          isDisabled={isEditing}
          label="Discord"
          readOnly={isEditing}
          variant="bordered"
        />
        <Input
          {...register('telegram')}
          className="w-full"
          isDisabled={isEditing}
          label="Telegram"
          readOnly={isEditing}
          variant="bordered"
        />
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select
              className="w-full"
              isDisabled={isEditing}
              label="Пол"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
            >
              <SelectItem key="male">Мужской</SelectItem>
              <SelectItem key="female">Женский</SelectItem>
            </Select>
          )}
        />
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          control={control}
          name="birth_date"
          render={({ field }) => (
            <DateInput
              className="w-full"
              isDisabled={isEditing}
              label="Дата рождения"
              value={parseISODate(field.value)}
              onChange={(date) => field.onChange(formatToISODate(date))}
            />
          )}
        />
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          control={control}
          name="country_code"
          render={({ field }) => (
            <Select
              className="w-full"
              isDisabled={isEditing}
              isLoading={!countries}
              label="Страна"
              placeholder="Выберите страну"
              selectedKeys={field.value ? [field.value] : []}
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
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <Select
              className="w-full"
              isDisabled={isEditing}
              label="Языки"
              selectedKeys={field.value || []}
              selectionMode="multiple"
              onSelectionChange={(keys) => field.onChange(Array.from(keys))}
            >
              <SelectItem key="russian">Русский</SelectItem>
              <SelectItem key="english">Английский</SelectItem>
              <SelectItem key="kazahstan">Казахский</SelectItem>
            </Select>
          )}
        />
      </div>
      {isOwnProfile && (
        <Button
          className={clsx('w-full', isEditing && 'hidden')}
          color="secondary"
          size="lg"
          onPress={() => handleSubmit(onSubmit)()}
        >
          Сохранить
        </Button>
      )}
    </Form>
  );
}
