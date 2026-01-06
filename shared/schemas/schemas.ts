import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен быть минимум 8 символов'),
});
