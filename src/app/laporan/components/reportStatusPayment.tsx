"use client";

import FormStatusPayment from "@/components/FormStatusPayment";
import { PaymentStatus } from "@prisma/client";
import React, { useState } from "react";

const ReportStatusPayment = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(date);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | string>(
    typeof window !== "undefined"
      ? localStorage.getItem("reportStatusPayment") ?? ""
      : ""
  );

  return (
    <div>
      <FormStatusPayment
        startDate={startDate}
        endDate={endDate}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
    </div>
  );
};

export default ReportStatusPayment;
