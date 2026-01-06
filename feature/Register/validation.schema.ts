import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Введите валидный email'),
    password: z.string().min(6, 'Пароль должен быть от 6 знаков и больше'),
    passwordRepeat: z.string().min(6, 'Пароль должен быть от 6 знаков и больше'),
    nickname: z.string().min(3, 'Никнейм должен быть от 3 знаков и больше'),
    discord: z.string().optional(),
    telegram: z.string().optional(),
  })
  .required({
    email: true,
    password: true,
    passwordRepeat: true,
    nickname: true,
  })
  .refine((data) => data.password === data.passwordRepeat, {
    message: 'Пароли не совпадают',
    path: ['passwordRepeat'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
