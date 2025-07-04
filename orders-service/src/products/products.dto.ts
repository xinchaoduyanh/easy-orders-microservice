import { z } from 'zod';

const ProductCategorySchema = z.enum([
  'ELECTRONICS',
  'CLOTHING',
  'BOOKS',
  'HOME_GARDEN',
  'SPORTS',
  'BEAUTY',
  'FOOD_BEVERAGE',
  'OTHER',
]);

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: ProductCategorySchema.default('OTHER'),
});
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: ProductCategorySchema.optional(),
});
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
