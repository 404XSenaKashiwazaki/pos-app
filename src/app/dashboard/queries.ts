"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { format } from "date-fns";

export interface Dashboards {
  totalRevenue: number;
  totalOrders: number;
  activeProductions: number;
  paidPayments: number;
}
export const getDashboards = async (): Promise<Response<Dashboards>> => {
  try {
    const [orders, productions, payments] = await Promise.all([
      prisma.order.findMany(),
      prisma.production.findMany(),
      prisma.payment.findMany(),
    ]);

    // 🔹 Hitung statistik
    const totalRevenue = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalOrders = orders.length;
    const activeProductions = productions.filter(
      (p) => p.status !== "CANCELED"
    ).length;
    const paidPayments =
      payments.length > 0
        ? Math.round(
            (payments.filter((p) => p.status === "PAID").length /
              payments.length) *
              100
          )
        : 0;

    return sendResponse({
      success: true,
      message: "Berhasil menggambil data",
      data: {
        totalRevenue,
        totalOrders,
        activeProductions,
        paidPayments,
      },
    });
  } catch (error) {
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal menggambil data",
    });
  }
};

export interface Chart {
  date: string;
  revenue: number;
  orders: number;
}
export const getDataForChart = async (): Promise<Response<Chart[]>> => {
  try {
    const res = await prisma.order.findMany({
      include: {
        payments: {
          where: {
            status: "PAID",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    const resGroup: Record<string, Chart> = {};
    if (Array.isArray(res) && res.length > 0) {
      for (const val of res) {
        let date = val.createdAt.toISOString().split("T")[0];
        
        if (!resGroup[date])
          resGroup[date] = {
            date,
            orders: 0,
            revenue: 0,
          };
        resGroup[date].revenue += Number(val.totalAmount);
        resGroup[date].orders += 1;
      }
    }

    return sendResponse({
      success: true,
      message: "Berhasil menggambil data",
      data: Object.values(resGroup),
    });
  } catch (error) {
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal menggambil data",
    });
  }
};
