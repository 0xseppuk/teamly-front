'use client';

import { Input, Textarea } from '@heroui/input';
import { Spacer } from '@heroui/spacer';
import { Control, Controller } from 'react-hook-form';

import { ApplicationFormData } from '../schema';

interface DetailsStepProps {
  control: Control<ApplicationFormData>;
}

export function DetailsStep({ control }: DetailsStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Детали заявки</h3>
        <p className="text-sm text-default-500">Расскажите о вашей заявке</p>
      </div>
      <Spacer y={2} />

      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            description="Краткое описание того, что вы ищете"
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            label="Название заявки"
            placeholder="Например: Прохождение кампании в кооперативе"
            variant="flat"
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            description="Минимум 10 символов, максимум 500"
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            label="Описание"
            maxRows={8}
            minRows={4}
            placeholder="Опишите подробнее, чего вы ожидаете от игроков, какой у вас опыт, что планируете делать..."
            variant="flat"
          />
        )}
      />
    </div>
  );
}
