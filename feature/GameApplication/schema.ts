import { z } from 'zod';

export const applicationSchema = z
  .object({
    game_id: z.string().min(1, 'Выберите игру'),
    title: z
      .string()
      .min(3, 'Минимум 3 символа')
      .max(100, 'Максимум 100 символов'),
    description: z
      .string()
      .min(10, 'Минимум 10 символов')
      .max(500, 'Максимум 500 символов'),
    min_players: z.number().min(1, 'Минимум 1 игрок').max(100),
    max_players: z.number().min(1, 'Минимум 1 игрок').max(100),
    prime_time_start: z.string().min(1, 'Укажите начало'),
    prime_time_end: z.string().min(1, 'Укажите конец'),
    with_voice_chat: z.boolean(),
    platform: z.enum([
      'pc',
      'playstation',
      'xbox',
      'nintendo_switch',
      'mobile',
    ]),
  })
  .refine((data) => data.max_players >= data.min_players, {
    message: 'Максимум должен быть больше или равен минимуму',
    path: ['max_players'],
  });

export type ApplicationFormData = z.infer<typeof applicationSchema>;
