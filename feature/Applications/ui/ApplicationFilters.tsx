import { Game } from '@/shared/services/games/games.types';
import { platformOptions, voiceChatOptions } from '@/shared/utils';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';

type FilterConfig = {
  label: string;
  placeholder: string;
  selectedKeys: string[];
  onChange: (value: string) => void;
  options: ReadonlyArray<{ key: string; label: string }> | Game[];
  isGame?: boolean;
};

interface ApplicationFiltersProps {
  selectedGame: string;
  selectedPlatform: string;
  withVoiceChat: string;
  games: Game[];
  onGameChange: (gameId: string) => void;
  onPlatformChange: (platform: string) => void;
  onVoiceChatChange: (voiceChat: string) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

export function ApplicationFilters({
  selectedGame,
  selectedPlatform,
  withVoiceChat,
  games,
  onGameChange,
  onPlatformChange,
  onVoiceChatChange,
  onClearFilters,
  isMobile = false,
}: ApplicationFiltersProps) {
  const filterConfigs: FilterConfig[] = [
    {
      label: 'Фильтр по игре',
      placeholder: 'Выберите игру',
      selectedKeys: selectedGame ? [selectedGame] : [],
      onChange: onGameChange,
      options: games,
      isGame: true,
    },
    {
      label: 'Платформа',
      placeholder: 'Выберите платформу',
      selectedKeys: selectedPlatform ? [selectedPlatform] : [],
      onChange: onPlatformChange,
      options: platformOptions,
    },
    {
      label: 'Голосовой чат',
      placeholder: 'Любой',
      selectedKeys: withVoiceChat ? [withVoiceChat] : [],
      onChange: onVoiceChatChange,
      options: voiceChatOptions,
    },
  ];

  const hasActiveFilters = selectedGame || selectedPlatform || withVoiceChat;

  return (
    <>
      {filterConfigs.map((config, index) => (
        <Select
          key={index}
          label={config.label}
          placeholder={config.placeholder}
          selectedKeys={config.selectedKeys}
          onChange={(e) => config.onChange(e.target.value)}
          className={isMobile ? 'w-full' : 'max-w-xs'}
        >
          {config.options.map((option) => {
            const key = config.isGame
              ? (option as Game).id
              : (option as { key: string }).key;
            const label = config.isGame
              ? (option as Game).name
              : (option as { label: string }).label;
            return <SelectItem key={key}>{label}</SelectItem>;
          })}
        </Select>
      ))}

      {hasActiveFilters && (
        <Button
          variant="flat"
          onPress={onClearFilters}
          className={isMobile ? 'w-full' : 'h-[56px]'}
        >
          Сбросить фильтры
        </Button>
      )}
    </>
  );
}
