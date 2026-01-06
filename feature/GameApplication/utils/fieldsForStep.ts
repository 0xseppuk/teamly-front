import { ApplicationFormData } from '../schema';

export function getFieldsForStep(step: number): (keyof ApplicationFormData)[] {
  switch (step) {
    case 0:
      return ['game_id'];
    case 1:
      return ['title', 'description'];
    case 2:
      return ['min_players', 'max_players', 'platform', 'with_voice_chat'];
    case 3:
      return ['prime_time_start', 'prime_time_end'];
    default:
      return [];
  }
}
