import React, { Suspense } from "react";
import { getOrders } from "./queries";
import DataTable from "./compoents/data-table";
import { getCustomers } from "../pelanggan/queries";
import { getUsers } from "../users/queries";
import { getHargaJenis } from "../harga-jenis/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Pemesanan`,
};
const Page = async () => {
  const { data } = await getOrders();
  const { data: customers } = await getCustomers();
  const { data: handles } = await getUsers();
  const { data: sablons } = await getHargaJenis();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable
            data={data ?? []}
            sablon={sablons ?? []}
            handle={handles ?? []}
            customer={customers ?? []}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
