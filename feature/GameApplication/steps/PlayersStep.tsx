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
        <p className="text-sm text-default-500">Укажите количество игроков и платформу</p>
      </div>
      <Spacer y={2} />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="min_players"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Минимум игроков"
              placeholder="1"
              variant="bordered"
              min={1}
              max={100}
              value={field.value?.toString() || ''}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="max_players"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="number"
              label="Максимум игроков"
              placeholder="5"
              variant="bordered"
              min={1}
              max={100}
              value={field.value?.toString() || ''}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              isInvalid={!!fieldState.error}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <Controller
        name="platform"
        control={control}
        render={({ field, fieldState }) => (
          <Select
            {...field}
            label="Платформа"
            placeholder="Выберите платформу"
            variant="bordered"
            isInvalid={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0];
              field.onChange(value);
            }}
          >
            {platforms.map((platform) => (
              <SelectItem key={platform.value} value={platform.value}>
                {platform.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <Controller
        name="with_voice_chat"
        control={control}
        render={({ field }) => (
          <Switch isSelected={field.value} onValueChange={field.onChange}>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">Голосовой чат</p>
              <p className="text-xs text-default-500">Требуется микрофон и голосовая связь</p>
            </div>
          </Switch>
        )}
      />
    </div>
  );
}
