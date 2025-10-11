import { Customer } from "@prisma/client";

export type FormCustomerValue = Partial<
  Omit<Customer, "createdAt" | "updatedAt">
>;
