import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().email('Введите валидный email'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
