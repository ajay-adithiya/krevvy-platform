import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  shortDescription: z.string().optional(),

  description: z.string().min(1, "Description is required"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  amazonUrl: z
    .string()
    .url("Invalid Amazon URL")
    .optional()
    .or(z.literal("")),

  isFeatured: z.boolean(),

  isActive: z.boolean(),

  categoryId: z.string().min(1, "Category is required"),
});

export type CreateProductFormValues = z.infer<
  typeof createProductSchema
>;