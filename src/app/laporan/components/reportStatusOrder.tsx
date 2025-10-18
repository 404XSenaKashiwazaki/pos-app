"use client";
import CardStatusOrder from "@/components/CardStatusOrder";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import ChartStatusOrder from "@/components/ChartStatusOrder";
import FormStatusOrder from "@/components/FormStatusOrder";

import { Customer, OrderStatus } from "@prisma/client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ByStatusOrdersToCard,
  GetAllStatusOrdersTable,
  getAllStatusOrdersTable,
  getByStatusOrdersToCard,
  getByStatusOrdersToCart,
} from "../queries";
import { toast } from "sonner";
import DataTable from "@/app/pemesanan/compoents/data-table";
import { ColumnOrderTypeDefProps } from "@/types/datatable";

const ReportStatusOrder = () => {
  const date = new Date();
  const [startDate, setStartDate] = useState<Date>(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(date);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | string>("");
  const [orderDatas, setOderDatas] = useState<ByStatusOrdersToCard[]>();
  const [orders, setOrders] = useState<ColumnOrderTypeDefProps[]>();
  const [customers, setCustomers] = useState<Customer[]>();

  const getAllStatusOrders = async () => {
    try {
      const { data, success } = await getByStatusOrdersToCard();
      if (success && Array.isArray(data) && data.length > 0) setOderDatas(data);

      const { data: ordersTable, success: successOrdersTable } =
        await getAllStatusOrdersTable();
      if (successOrdersTable) {
        setOrders(ordersTable?.orders);
        setCustomers(ordersTable?.customers);
      }
    } catch (error) {
      toast.error("Ops...");
    }
  };

  useEffect(() => {
    getAllStatusOrders();
  }, []);

  return (
    <div>
      <FormStatusOrder
        startDate={startDate}
        endDate={endDate}
        orderStatus={orderStatus}
        setOrderStatus={setOrderStatus}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      <div>
        <CardStatusOrder data={orderDatas ?? []} />
        {/* <ChartStatusOrder /> */}
      </div>
    </div>
  );
};

export default ReportStatusOrder;
