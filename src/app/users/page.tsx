import React from "react";
import { getUsers } from "./queries";
import { Metadata } from "next";
import TableSection from "./compoents/table";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Users`,
};
const Page = async () => {
  const { data } = await getUsers();
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <TableSection data={data ?? []} />
      </div>
    </div>
  );
};

export default Page;
