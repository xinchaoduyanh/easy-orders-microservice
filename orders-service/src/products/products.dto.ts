import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number(),
});
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
});
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
