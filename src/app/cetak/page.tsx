import React from "react";
import { Metadata } from "next";
import PrintSection from "./components/print";

export const metadata: Metadata = {
  title: `${
    (process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".", "") ?? ``
  } - Cetak Laporan`,
};
const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <PrintSection />
    </div>
  );
};

export default Page;
