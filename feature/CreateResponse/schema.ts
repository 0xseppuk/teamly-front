import { z } from 'zod';

export const createResponseSchema = z.object({
  message: z
    .string()
    .min(10, 'Сообщение должно содержать минимум 10 символов')
    .max(500, 'Сообщение не должно превышать 500 символов'),
});

export type CreateResponseFormData = z.infer<typeof createResponseSchema>;
