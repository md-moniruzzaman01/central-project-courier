import { Prisma } from "@prisma/client";

export type IReceiverFilterRequest = {
  searchTerm?: string;
};

export type SenderInput = {
  tenantId?: string;
  name: string;
  email: string;
  phone: string;
  type?: 'REGULAR' | 'MONTHLY';
  createdBy?: string;
  address?: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
};