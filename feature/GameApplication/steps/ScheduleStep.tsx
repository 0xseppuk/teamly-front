'use client';

import { Input } from '@heroui/input';
import { Spacer } from '@heroui/spacer';
import { Control, Controller } from 'react-hook-form';

import { ApplicationFormData } from '../schema';

interface ScheduleStepProps {
  control: Control<ApplicationFormData>;
}

export function ScheduleStep({ control }: ScheduleStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Расписание игр</h3>
        <p className="text-sm text-default-500">
          Укажите предпочитаемое время для игры
        </p>
      </div>
      <Spacer y={2} />

      <div className="rounded-lg bg-default-100 p-4">
        <p className="mb-2 text-sm font-medium">Прайм-тайм</p>
        <p className="text-xs text-default-500">
          Время, когда вы обычно играете и хотите, чтобы игроки были онлайн
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="prime_time_start"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              description="С какого времени"
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              label="Начало"
              type="time"
              variant="flat"
            />
          )}
        />

        <Controller
          control={control}
          name="prime_time_end"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              description="До какого времени"
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              label="Конец"
              type="time"
              variant="flat"
            />
          )}
        />
      </div>

      <div className="rounded-lg border border-default-200 p-4">
        <p className="text-xs text-default-500">
          💡 <span className="font-medium">Совет:</span> Укажите реалистичное
          время, когда вы действительно сможете играть. Это поможет найти
          подходящих игроков.
        </p>
      </div>
    </div>
  );
}
