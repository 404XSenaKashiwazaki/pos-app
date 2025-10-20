import React, { Suspense } from "react";
import { getProductions } from "./queries";
import DataTable from "./compoents/data-table";
import { getUsers } from "../users/queries";
import { getHargaJenis } from "../harga-jenis/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Produksi`,
};
const Page = async () => {
  const { data } = await getProductions();
  const { data: handles } = await getUsers();
  const { data: sablons } = await getHargaJenis();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable
            handle={handles ?? []}
            sablon={sablons ?? []}
            data={data ?? []}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
