import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Пароль должен быть от 6 знаков и больше'),
    confirmPassword: z.string().min(6, 'Подтвердите пароль'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
