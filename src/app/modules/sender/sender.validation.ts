import { z } from 'zod';

const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(), // ✅ keep string instead of number
  country: z.string().min(1, "Country is required"),
});

const create = z.object({
  body: z.object({
    tenantId: z.string().optional(),
    name: z.string().min(1, "Sender name is required"),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().min(5, "Phone is required").optional(),
    type: z.enum(["REGULAR", "MONTHLY"]).default("REGULAR"),
    address: AddressSchema,
  }),
});
const update = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    type: z.enum(["REGULAR", "MONTHLY"]).optional(),
    address: AddressSchema.partial(),
    isActive: z.boolean().optional(),
  }),
});

export const senderValidation = {
  create,
  update
};
