import React, { Suspense } from "react";
import { getPayments } from "./queries";
import DataTable from "./compoents/data-table";
import { getOrders } from "../pemesanan/queries";
import { prisma } from "@/lib/prisma";

const Page = async () => {
  const { data } = await getPayments();
  const orders = await prisma.order.findMany({
    where: {
      payments: {
        none: {
          type: "FINAL",
          status: "PAID",
        },
      },
    },
    include: {
      customer: true,
      items: true,
      payments: true
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable data={data ?? []} orders={orders ?? []} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
