import React from "react";
import { getPemesanan } from "./queries";
import DataTable from "./compoents/data-table";

const Page = async () => {
  const { data } = await getPemesanan();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <DataTable data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
