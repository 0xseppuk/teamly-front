import { z } from 'zod';

export const profileValidationSchema = z.object({
  discord: z.string().optional(),
  telegram: z.string().optional(),
  country_code: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  birth_date: z.string().optional(), // ISO date string
  description: z.string().optional(),
  languages: z.array(z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileValidationSchema>;
