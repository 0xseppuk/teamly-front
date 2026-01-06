'use client';

import { Textarea } from '@heroui/input';
import { Control, Controller } from 'react-hook-form';

import type { CreateResponseFormData } from '../schema';

interface ResponseFormProps {
  control: Control<CreateResponseFormData>;
  isDisabled?: boolean;
}

export function ResponseForm({ control, isDisabled }: ResponseFormProps) {
  return (
    <div className="space-y-4">
      <Controller
        name="message"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Сопроводительное сообщение"
            placeholder="Привет! Хочу присоединиться к вашей команде. Играю на позиции саппорта, ранк Gold Nova 3..."
            variant="bordered"
            minRows={6}
            maxRows={10}
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            description="Расскажите о себе и почему хотите присоединиться (10-500 символов)"
            isDisabled={isDisabled}
          />
        )}
      />

      {/* Подсказка */}
      <div className="rounded-lg border border-default-200 bg-default-50/50 p-3">
        <p className="text-xs text-default-600">
          💡 <span className="font-medium">Совет:</span> Укажите ваш опыт в
          игре, предпочитаемую роль и доступное время для игры
        </p>
      </div>
    </div>
  );
}
