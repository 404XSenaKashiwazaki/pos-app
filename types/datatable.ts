import { Customer, Order, OrderItem, Prisma, SablonType, User } from "@prisma/client";


export type ColumnPelangganDefProps  = Omit<Customer,"updatedAt">

export type ColumnUserDefProps  = Omit<User,"updatedAt"|"password">

export type ColumnSablonTypeDefProps  = Omit<SablonType,"updatedAt">

export type ColumnOrderTypeDefProps  = Omit<Prisma.OrderGetPayload<{
    include: {customer: true,items: true, designs: true}
}>,"updatedAt">