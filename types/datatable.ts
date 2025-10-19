import {
  Customer,
  Order,
  OrderItem,
  Prisma,
  SablonType,
  User,
} from "@prisma/client";

export type ColumnPelangganDefProps = Omit<Customer, "updatedAt">;

export type ColumnUserDefProps = Omit<User, "updatedAt" | "password">;

export type ColumnSablonTypeDefProps = Omit<SablonType, "updatedAt">;

export type ColumnOrderTypeDefProps = Omit<
  Prisma.OrderGetPayload<{
    include: {
      customer: true;
      items: {
        include: {
          production: true;
        };
      };
      designs: true;
    };
  }>,
  "updatedAt"
>;

export type ColumnPaymentTypeDefProps = Omit<
  Prisma.PaymentGetPayload<{
    include: {
      order: {
        include: { customer: true; items: true };
      };
    };
  }>,
  "updatedAt"
>;

export type ColumnProductionTypeDefProps = Omit<
  Prisma.ProductionGetPayload<{
    include: {
      orderItem: true;
      assignedTo: true;
      sablonType: true;
    };
  }>,
  "updatedAt"
>;
