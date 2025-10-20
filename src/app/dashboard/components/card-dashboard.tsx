"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconPackage, IconPrinter, IconCreditCard } from "@tabler/icons-react"
import { Dashboards } from "../queries"
import { formatCurrency } from "@/lib/formatCurrency"


const CardDashboard = ({ totalRevenue, totalOrders, activeProductions, paidPayments }: Dashboards) => {
  return (
    <>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Pembayaran</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              { formatCurrency(totalRevenue ?? 0) }
            </CardTitle>
            <div className="flex items-center gap-1">
              <Badge variant="outline">
                <IconCreditCard className="mr-1 size-5 text-green-600" /> { formatCurrency(totalRevenue ?? 0) }
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Total Orders */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Pemesan</CardDescription>
            <CardTitle className="text-2xl font-semibold">{ totalOrders }</CardTitle>
            <Badge variant="outline">
              <IconPackage className="mr-1 size-5 text-green-600" /> { totalOrders } Pemesan
            </Badge>
          </CardHeader>
        </Card>

        {/* Active Productions */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Produksi</CardDescription>
            <CardTitle className="text-2xl font-semibold">{ activeProductions }</CardTitle>
            <Badge variant="outline">
              <IconPrinter className="mr-1 size-5 text-green-600" /> { activeProductions} Poduksi
            </Badge>
          </CardHeader>
        </Card>

        {/* Paid Payments */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Pembayaran Berhasil</CardDescription>
            <CardTitle className="text-2xl font-semibold">{ paidPayments }%</CardTitle>
            <Badge variant="outline">
              <IconCreditCard className="mr-1 size-5 text-green-600" /> { paidPayments }% Berhasil
            </Badge>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

export default CardDashboard