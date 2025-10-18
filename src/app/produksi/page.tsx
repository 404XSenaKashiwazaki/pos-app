import React, { Suspense } from "react";
import { getProductions } from "./queries";
import DataTable from "./compoents/data-table";

const Page = async () => {
  const { data } = await getProductions();

  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable data={data ?? []} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
