import React from "react";
import { getUsers } from "./queries";
import DataTable from "./compoents/data-table";

const Page = async () => {
  const { data } = await getUsers()
if(!data || data?.length === 0) return null
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
      <DataTable data={data}/>
      </div>
    </div>
  );
};

export default Page;
