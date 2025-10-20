import React from "react";
import Profile from "./components/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `${(process.env.NEXT_PUBLIC_APP_NAME as string).replaceAll(".","") ?? ``} - Pengaturan`,
};
const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <Profile />
      </div>
    </div>
  );
};

export default Page;
