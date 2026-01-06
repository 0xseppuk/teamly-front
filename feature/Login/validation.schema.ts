import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email('Введите валидный email'),
    password: z.string().min(6, 'Пароль должен быть от 6 знаков и больше'),
  })
  .required();

export type LoginFormData = z.infer<typeof loginSchema>;
