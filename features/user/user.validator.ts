import { z } from 'zod';

export const createPersonSchema = z.object({
  body: z.object({
    personToMeet: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    password: z.string().optional()
  })
});

export const updatePersonSchema = z.object({
  body: z.object({
    personToMeet: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    password: z.string().optional()
  })
});
