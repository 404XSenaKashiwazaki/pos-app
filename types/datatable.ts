import { Customer, SablonType, User } from "@prisma/client";


export type ColumnPelangganDefProps  = Omit<Customer,"updatedAt">

export type ColumnUserDefProps  = Omit<User,"updatedAt"|"password">

export type ColumnSablonTypeDefProps  = Omit<SablonType,"updatedAt">