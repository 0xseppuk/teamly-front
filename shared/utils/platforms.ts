export function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    pc: 'PC',
    playstation: 'PlayStation',
    xbox: 'Xbox',
    nintendo_switch: 'Nintendo Switch',
    mobile: 'Mobile',
  };

  return labels[platform] || platform;
}

export const platformOptions = [
  { key: 'pc', label: 'PC' },
  { key: 'playstation', label: 'PlayStation' },
  { key: 'xbox', label: 'Xbox' },
  { key: 'nintendo_switch', label: 'Nintendo Switch' },
  { key: 'mobile', label: 'Mobile' },
] as const;

export const voiceChatOptions = [
  { key: 'true', label: 'Только с голосовым чатом' },
] as const;
