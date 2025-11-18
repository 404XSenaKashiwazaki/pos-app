"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Customer, SablonType, User } from "@prisma/client";
import { ColumnOrderTypeDefProps } from "@/types/datatable";
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
  data: ColumnOrderTypeDefProps[];
  customers: Customer[];
  handles: User[];
  sablons: SablonType[];
}
const TableSection: React.FC<TableSectionProps> = ({
  data,
  customers,
  handles,
  sablons,
}) => {
  return (
    <div>
      <DataTable
        data={data}
        sablon={sablons}
        handle={handles}
        customer={customers}
      />
    </div>
  );
};

export default TableSection;
