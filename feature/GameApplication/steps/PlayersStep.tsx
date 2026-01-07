'use client';

import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Spacer } from '@heroui/spacer';
import { Switch } from '@heroui/switch';
import { Control, Controller } from 'react-hook-form';

import { ApplicationFormData } from '../schema';

interface PlayersStepProps {
  control: Control<ApplicationFormData>;
}

const platforms = [
  { value: 'pc', label: 'PC' },
  { value: 'playstation', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'nintendo_switch', label: 'Nintendo Switch' },
  { value: 'mobile', label: 'Mobile' },
];

export function PlayersStep({ control }: PlayersStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Настройки группы</h3>
        <p className="text-sm text-default-500">
          Укажите количество игроков и платформу
        </p>
      </div>
      <Spacer y={2} />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          control={control}
          name="min_players"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              label="Минимум игроков"
              max={100}
              min={1}
              placeholder="1"
              type="number"
              value={field.value?.toString() || ''}
              variant="bordered"
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
            />
          )}
        />

        <Controller
          control={control}
          name="max_players"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              errorMessage={fieldState.error?.message}
              isInvalid={!!fieldState.error}
              label="Максимум игроков"
              max={100}
              min={1}
              placeholder="5"
              type="number"
              value={field.value?.toString() || ''}
              variant="bordered"
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="platform"
        render={({ field, fieldState }) => (
          <Select
            {...field}
            errorMessage={fieldState.error?.message}
            isInvalid={!!fieldState.error}
            label="Платформа"
            placeholder="Выберите платформу"
            selectedKeys={field.value ? [field.value] : []}
            variant="bordered"
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];

              field.onChange(value);
            }}
          >
            {platforms.map((platform) => (
              <SelectItem key={platform.value}>{platform.label}</SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        control={control}
        name="with_voice_chat"
        render={({ field }) => (
          <Switch isSelected={field.value} onValueChange={field.onChange}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Голосовой чат</p>
              <p className="text-xs text-default-500">
                Требуется микрофон и голосовая связь
              </p>
            </div>
          </Switch>
        )}
      />
    </div>
  );
}
