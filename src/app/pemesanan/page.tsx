import React from "react";
import { getOrders } from "./queries";
import DataTable from "./compoents/data-table";
import { getCustomers } from "../pelanggan/queries";

const Page = async () => {
  const { data } = await getOrders();
  const { data: customer } = await getCustomers()
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <DataTable data={data ?? []} customer={customer ?? []} />
      </div>
    </div>
  );
};

export default Page;
