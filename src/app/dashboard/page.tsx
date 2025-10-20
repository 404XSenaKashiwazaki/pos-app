import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Dashboard`,
};

const Page = () => {
  return <div>Page</div>;
};

export default Page;
