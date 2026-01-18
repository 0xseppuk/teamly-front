const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-pink-500',
  'bg-fuchsia-500',
  'bg-purple-500',
  'bg-violet-500',
  'bg-indigo-500',
  'bg-blue-500',
  'bg-sky-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-emerald-500',
  'bg-green-500',
  'bg-lime-500',
  'bg-amber-500',
  'bg-orange-500',
  'bg-red-500',
];

/**
 * Generates a consistent avatar background color based on user identifier.
 * The same identifier will always return the same color.
 */
export function getAvatarColor(identifier: string | undefined): string {
  if (!identifier) return AVATAR_COLORS[0];

  // Simple hash function to get consistent index
  let hash = 0;

  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i);

    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % AVATAR_COLORS.length;

  return AVATAR_COLORS[index];
}
