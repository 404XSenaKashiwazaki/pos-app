import { Customer, SablonType } from "@prisma/client";

export type FormCustomerValue = Partial<
  Omit<Customer, "createdAt" | "updatedAt">
>;


export type FormHargaJenisValue = Partial<
  Omit<SablonType, "createdAt" | "updatedAt">
>;
