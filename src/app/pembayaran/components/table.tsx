"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Prisma } from "@prisma/client";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
const DataTable = dynamic(() => import("./data-table"), {
  loading: () => (
    <div>
      <Skeleton className="w-1/2 h-10 mb-1" />
      <Skeleton className="w-full h-96" />
    </div>
  ),
  ssr: false,
});

interface TableSectionProps {
  data: ColumnPaymentTypeDefProps[];
  orders: Prisma.OrderGetPayload<{
    include: { customer: true; items: true; payments: true };
  }>[];
}
const TableSection: React.FC<TableSectionProps> = ({ data, orders }) => {
  return (
    <div>
      <DataTable data={data} orders={orders} />
    </div>
  );
};

export default TableSection;
