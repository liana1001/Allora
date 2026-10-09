import { z } from 'zod';

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(z.unknown()),
    requestId: z.string(),
  }),
});

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.literal('api'),
  timestamp: z.string(),
});

export const moneySchema = z.object({
  amountMinor: z.number().int(),
  currency: z.string().length(3).toUpperCase(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type Money = z.infer<typeof moneySchema>;

export * from './account.js';
