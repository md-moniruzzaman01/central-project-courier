import z from 'zod';

// ✅ Product Schema
const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  weight: z.number().positive('Weight must be a positive number (kg)'),
  description: z.string().min(1, 'Product description is required'),
  hsCode: z.string().min(1, 'HS Code is required'),
  declaredValue: z
    .number()
    .positive('Declared value must be a positive number'),
  sku: z.string().optional(),
});

// ✅ Box Schema
const boxSchema = z.object({
  boxLength: z.number().positive('Box length must be a positive number'),
  boxWidth: z.number().positive('Box width must be a positive number'),
  boxHeight: z.number().positive('Box height must be a positive number'),
  boxWeight: z.number().positive('Box weight must be a positive number'),
  products: z.array(productSchema).nonempty('At least one product is required'),
});

const create = z.object({
  body: z.object({
    senderId: z.number().min(1, 'Sender ID is required'),
    recipientId: z.number().min(1, 'Recipient ID is required'),
    hawb: z.string().min(1, 'hawb no. is required'),
    referenceCode: z.string().optional(),
    thirdParty: z.enum(['NONE', 'DHL', 'FEDEX', 'UPS', 'OTHER']).optional(),
    boxes: z.array(boxSchema).nonempty('At least one box is required'),
  }),
});

// --------------------- Product Schema ---------------------
const updateProductSchema = z.object({
  id: z.number().optional(), // Include if updating existing product
  name: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  price: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  description: z.string().optional(),
  hsCode: z.string().optional(),
  declaredValue: z.number().positive().optional(),
  sku: z.string().optional(),
});

// --------------------- Box Schema ---------------------
const updateBoxSchema = z.object({
  id: z.string().optional(), // Include if updating existing box
  label: z.string().optional(),
  boxLength: z.number().positive().optional(),
  boxWidth: z.number().positive().optional(),
  boxHeight: z.number().positive().optional(),
  boxWeight: z.number().positive().optional(),
  shipmentId: z.string().optional(),
  products: z.array(updateProductSchema).optional(),
});

const update = z.object({
  body: z.object({
    senderId: z.string().optional(),
    recipientId: z.string().optional(),
    hawb: z.string().optional(),
    referenceCode: z.string().optional(),
    tenantId: z.string().optional(),
    totalDeclaredValue: z.number().optional(),
    weight: z.number().optional(),
    thirdParty: z.enum(['NONE', 'DHL', 'FEDEX', 'UPS', 'OTHER']).optional(),
    boxes: z.array(updateBoxSchema).optional(),
  }),
});

export const courierValidation = {
  create,
  update,
};
