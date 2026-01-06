import { Country } from '@/shared/types';
import { formatToISODate, parseISODate } from '@/shared/utils/date';
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

type ProfileFormProps = {
  defaultValues?: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  isEditing?: boolean;
  countries?: Country[];
};

export function ProfileForm({
  defaultValues,
  onSubmit,
  isEditing = false,
  countries,
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
          label="Discord"
          readOnly={isEditing}
          variant="bordered"
          isDisabled={isEditing}
          className="w-full"
        />
        <Input
          {...register('telegram')}
          label="Telegram"
          readOnly={isEditing}
          variant="bordered"
          isDisabled={isEditing}
          className="w-full"
        />
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select
              label="Пол"
              className="w-full"
              isDisabled={isEditing}
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
          name="birth_date"
          control={control}
          render={({ field }) => (
            <DateInput
              isDisabled={isEditing}
              label="Дата рождения"
              className="w-full"
              value={parseISODate(field.value)}
              onChange={(date) => field.onChange(formatToISODate(date))}
            />
          )}
        />
      </div>
      <div className="flex gap-4 w-full">
        <Controller
          name="country_code"
          control={control}
          render={({ field }) => (
            <Select
              isDisabled={isEditing}
              label="Страна"
              className="w-full"
              placeholder="Выберите страну"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}
              isLoading={!countries}
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
          name="languages"
          control={control}
          render={({ field }) => (
            <Select
              isDisabled={isEditing}
              label="Языки"
              className="w-full"
              selectionMode="multiple"
              selectedKeys={field.value || []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys))}
            >
              <SelectItem key="russian">Русский</SelectItem>
              <SelectItem key="english">Английский</SelectItem>
              <SelectItem key="kazahstan">Казахский</SelectItem>
            </Select>
          )}
        />
      </div>
      <Button
        onPress={() => handleSubmit(onSubmit)()}
        className={clsx('w-full', isEditing && 'hidden')}
        color="secondary"
        size="lg"
      >
        Сохранить
      </Button>
    </Form>
  );
}
