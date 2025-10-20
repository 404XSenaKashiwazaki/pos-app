"use client";
import React from "react";
import ReportStatusOrder from "./components/reportStatusOrder";
import ReportStatusPayment from "./components/reportStatusPayment";

const CardReport = () => {
  return (
    <div className="flex flex-col gap-1">
      <ReportStatusOrder />
      <ReportStatusPayment />
    </div>
  );
};

export default CardReport;
