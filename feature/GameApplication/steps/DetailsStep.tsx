'use client';

import { Input } from '@heroui/input';
import { Spacer } from '@heroui/spacer';
import { Textarea } from '@heroui/input';
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
        name="title"
        control={control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            label="Название заявки"
            placeholder="Например: Прохождение кампании в кооперативе"
            variant="bordered"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            description="Краткое описание того, что вы ищете"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Описание"
            placeholder="Опишите подробнее, чего вы ожидаете от игроков, какой у вас опыт, что планируете делать..."
            variant="bordered"
            minRows={4}
            maxRows={8}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            description="Минимум 10 символов, максимум 500"
          />
        )}
      />
    </div>
  );
}
