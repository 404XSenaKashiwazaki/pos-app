"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/formatCurrency";

const ChartStatusOrder = ({
  data,
  startDate,
  endDate,
}: {
  data?: [];
  startDate?: Date;
  endDate?: Date;
}) => {
  const chartData = useMemo(
    () => [
      { name: "Total Revenue", value: 0 },
      { name: "Pemesanan", value: 0 },
    ],
    [data]
  );
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Laporan Laba Rugi</CardTitle>
        {startDate && endDate && (
          <p className="text-sm text-muted-foreground">
            Periode: {new Date(startDate).toLocaleDateString("id-ID")} -{" "}
            {new Date(endDate).toLocaleDateString("id-ID")}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Stat label="Total Revenue" value={formatCurrency(10)} />
          <Stat label="Pemesanan Sablon" value={"11"} />
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start justify-center border p-3 rounded-xl bg-muted/30 ">
      <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
      <span className="text-sm md:text-md font-semibold text-primary">
        {value}
      </span>
    </div>
  );
}

export default ChartStatusOrder;
