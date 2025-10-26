import React, { Suspense } from "react";
import { getUsers } from "./queries";
import DataTable from "./compoents/data-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Users`,
};
const Page = async () => {
  const { data } = await getUsers();
  if (!data || data?.length === 0) return null;
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable data={data} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
