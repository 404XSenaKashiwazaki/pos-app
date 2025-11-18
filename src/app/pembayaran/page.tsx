import React from "react";
import { getPayments } from "./queries";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import TableSection from "./components/table";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Pembayaran`,
};
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
        <TableSection data={data ?? []} orders={orders ?? []} />
      </div>
    </div>
  );
};

export default Page;
