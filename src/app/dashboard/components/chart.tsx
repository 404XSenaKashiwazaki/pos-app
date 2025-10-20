"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconPackage, IconPrinter, IconCreditCard } from "@tabler/icons-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"


// ==== Dummy data (bisa diganti dari Prisma API route) ====
const chartData = [
  { date: "2025-10-01", revenue: 4500000, orders: 12 },
  { date: "2025-10-02", revenue: 3200000, orders: 9 },
  { date: "2025-10-03", revenue: 5800000, orders: 15 },
  { date: "2025-10-04", revenue: 7200000, orders: 20 },
  { date: "2025-10-05", revenue: 6900000, orders: 18 },
  { date: "2025-10-06", revenue: 5400000, orders: 13 },
  { date: "2025-10-07", revenue: 8000000, orders: 22 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

// ==== Komponen utama dashboard ====
const  DashboardChart = () =>  {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="grid mt-1 md:mt-5 p-0">
      {/* --- Section: Stats Cards --- */}
      

      {/* --- Section: Interactive Chart --- */}
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Revenue & Orders</CardTitle>
            <CardDescription>
              Showing performance for the last 7 days
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
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
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("id-ID", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="url(#fillOrders)"
                stroke="var(--color-orders)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}


export default DashboardChart