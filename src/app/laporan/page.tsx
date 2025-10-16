import React from "react";
import ReportStatus from "./components/reportStatus";
import ReportDate from "./components/reportDate";

const Page = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="w-full">
        <ReportStatus />
        <ReportDate />
      </div>
    </div>
  );
};

export default Page;
