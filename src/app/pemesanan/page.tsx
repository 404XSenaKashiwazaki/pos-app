import React from "react";
import { getOrders } from "./queries";
import DataTable from "./compoents/data-table";
import { getCustomers } from "../pelanggan/queries";
import { getUsers } from "../users/queries";
import { getHargaJenis } from "../harga-jenis/queries";

const Page = async () => {
  const { data } = await getOrders();
  const { data: customers } = await getCustomers();
  const { data: handles } = await getUsers();
  const { data: sablons } = await getHargaJenis();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <DataTable
          data={data ?? []}
          sablon={sablons ?? []}
          handle={handles ?? []}
          customer={customers ?? []}
        />
      </div>
    </div>
  );
};

export default Page;
