import { z } from 'zod';

export const createDataSchema = z.object({
  body: z.object({
    personToMeet: z.string().min(1, 'Person name is required'),
    phone: z.string().optional(),
    designation: z.string().optional(),
    status: z.string().optional(),
  })
});

export const updateDataSchema = z.object({
  body: z.object({
    personToMeet: z.string().optional(),
    phone: z.string().optional(),
    designation: z.string().optional(),
    status: z.string().optional(),
  })
});
