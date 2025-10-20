import React from "react";
import { getHargaJenis } from "./queries";
import DataTable from "./compoents/data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Harga & Jenis`,
};
const Page = async () => {
  const { data } = await getHargaJenis();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <DataTable data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
