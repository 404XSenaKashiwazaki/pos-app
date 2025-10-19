"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", pending: 222, confirmed: 150 },
  { date: "2024-04-02", pending: 97, confirmed: 180 },
  { date: "2024-04-03", pending: 167, confirmed: 120 },
  { date: "2024-04-04", pending: 242, confirmed: 260 },
  { date: "2024-04-05", pending: 373, confirmed: 290 },
  { date: "2024-04-06", pending: 301, confirmed: 340 },
  { date: "2024-04-07", pending: 245, confirmed: 180 },
  { date: "2024-04-08", pending: 409, confirmed: 320 },
  { date: "2024-04-09", pending: 59, confirmed: 110 },
  { date: "2024-04-10", pending: 261, confirmed: 190 },
  { date: "2024-04-11", pending: 327, confirmed: 350 },
  { date: "2024-04-12", pending: 292, confirmed: 210 },
  { date: "2024-04-13", pending: 342, confirmed: 380 },
  { date: "2024-04-14", pending: 137, confirmed: 220 },
  { date: "2024-04-15", pending: 120, confirmed: 170 },
  { date: "2024-04-16", pending: 138, confirmed: 190 },
  { date: "2024-04-17", pending: 446, confirmed: 360 },
  { date: "2024-04-18", pending: 364, confirmed: 410 },
  { date: "2024-04-19", pending: 243, confirmed: 180 },
  { date: "2024-04-20", pending: 89, confirmed: 150 },
  { date: "2024-04-21", pending: 137, confirmed: 200 },
  { date: "2024-04-22", pending: 224, confirmed: 170 },
  { date: "2024-04-23", pending: 138, confirmed: 230 },
  { date: "2024-04-24", pending: 387, confirmed: 290 },
  { date: "2024-04-25", pending: 215, confirmed: 250 },
  { date: "2024-04-26", pending: 75, confirmed: 130 },
  { date: "2024-04-27", pending: 383, confirmed: 420 },
  { date: "2024-04-28", pending: 122, confirmed: 180 },
  { date: "2024-04-29", pending: 315, confirmed: 240 },
  { date: "2024-04-30", pending: 454, confirmed: 380 },
  { date: "2024-05-01", pending: 165, confirmed: 220 },
  { date: "2024-05-02", pending: 293, confirmed: 310 },
  { date: "2024-05-03", pending: 247, confirmed: 190 },
  { date: "2024-05-04", pending: 385, confirmed: 420 },
  { date: "2024-05-05", pending: 481, confirmed: 390 },
  { date: "2024-05-06", pending: 498, confirmed: 520 },
  { date: "2024-05-07", pending: 388, confirmed: 300 },
  { date: "2024-05-08", pending: 149, confirmed: 210 },
  { date: "2024-05-09", pending: 227, confirmed: 180 },
  { date: "2024-05-10", pending: 293, confirmed: 330 },
  { date: "2024-05-11", pending: 335, confirmed: 270 },
  { date: "2024-05-12", pending: 197, confirmed: 240 },
  { date: "2024-05-13", pending: 197, confirmed: 160 },
  { date: "2024-05-14", pending: 448, confirmed: 490 },
  { date: "2024-05-15", pending: 473, confirmed: 380 },
  { date: "2024-05-16", pending: 338, confirmed: 400 },
  { date: "2024-05-17", pending: 499, confirmed: 420 },
  { date: "2024-05-18", pending: 315, confirmed: 350 },
  { date: "2024-05-19", pending: 235, confirmed: 180 },
  { date: "2024-05-20", pending: 177, confirmed: 230 },
  { date: "2024-05-21", pending: 82, confirmed: 140 },
  { date: "2024-05-22", pending: 81, confirmed: 120 },
  { date: "2024-05-23", pending: 252, confirmed: 290 },
  { date: "2024-05-24", pending: 294, confirmed: 220 },
  { date: "2024-05-25", pending: 201, confirmed: 250 },
  { date: "2024-05-26", pending: 213, confirmed: 170 },
  { date: "2024-05-27", pending: 420, confirmed: 460 },
  { date: "2024-05-28", pending: 233, confirmed: 190 },
  { date: "2024-05-29", pending: 78, confirmed: 130 },
  { date: "2024-05-30", pending: 340, confirmed: 280 },
  { date: "2024-05-31", pending: 178, confirmed: 230 },
  { date: "2024-06-01", pending: 178, confirmed: 200 },
  { date: "2024-06-02", pending: 470, confirmed: 410 },
  { date: "2024-06-03", pending: 103, confirmed: 160 },
  { date: "2024-06-04", pending: 439, confirmed: 380 },
  { date: "2024-06-05", pending: 88, confirmed: 140 },
  { date: "2024-06-06", pending: 294, confirmed: 250 },
  { date: "2024-06-07", pending: 323, confirmed: 370 },
  { date: "2024-06-08", pending: 385, confirmed: 320 },
  { date: "2024-06-09", pending: 438, confirmed: 480 },
  { date: "2024-06-10", pending: 155, confirmed: 200 },
  { date: "2024-06-11", pending: 92, confirmed: 150 },
  { date: "2024-06-12", pending: 492, confirmed: 420 },
  { date: "2024-06-13", pending: 81, confirmed: 130 },
  { date: "2024-06-14", pending: 426, confirmed: 380 },
  { date: "2024-06-15", pending: 307, confirmed: 350 },
  { date: "2024-06-16", pending: 371, confirmed: 310 },
  { date: "2024-06-17", pending: 475, confirmed: 520 },
  { date: "2024-06-18", pending: 107, confirmed: 170 },
  { date: "2024-06-19", pending: 341, confirmed: 290 },
  { date: "2024-06-20", pending: 408, confirmed: 450 },
  { date: "2024-06-21", pending: 169, confirmed: 210 },
  { date: "2024-06-22", pending: 317, confirmed: 270 },
  { date: "2024-06-23", pending: 480, confirmed: 530 },
  { date: "2024-06-24", pending: 132, confirmed: 180 },
  { date: "2024-06-25", pending: 141, confirmed: 190 },
  { date: "2024-06-26", pending: 434, confirmed: 380 },
  { date: "2024-06-27", pending: 448, confirmed: 490 },
  { date: "2024-06-28", pending: 149, confirmed: 200 },
  { date: "2024-06-29", pending: 103, confirmed: 160 },
  { date: "2024-06-30", pending: 446, confirmed: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  pending: {
    label: "Pending",
    color: "var(--chart-1)",
  },
  confirmed: {
    label: "Confirmed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const SelectItems = [
  {
    value: "90d",
    title: " Last 3 months",
  },
  {
    value: "30d",
    title: "  Last 30 days",
  },
  {
    value: "7d",
    title: " Last 7 days",
  },
];
const ChartStatusOrder = () => {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [totalRange, setTotalRange] = React.useState("Last 3 months");
  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>Showing total visitors for the {totalRange}</CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(e) => {
            const select = SelectItems.find((e2) => e == e2.value);
            setTotalRange(select?.title ?? "Last 3 months");
            setTimeRange(e);
          }}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {SelectItems.map((e) => (
              <SelectItem value={e.value} key={e.value} className="rounded-lg">
                {e.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillConfirmed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-confirmed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pending"
              type="natural"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              stackId="a"
            />
            <Area
              dataKey="confirmed"
              type="natural"
              fill="url(#fillConfirmed)"
              stroke="var(--color-confirmed)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartStatusOrder;
