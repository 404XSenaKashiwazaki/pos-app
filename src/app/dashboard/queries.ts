"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";

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
    const activeProductions = productions.filter((p) => p.status !== "CANCELED").length;
    const paidPayments =
      payments.length > 0
        ? Math.round(
            (payments.filter((p) => p.status === "PAID").length / payments.length) * 100
          )
        : 0;

    return sendResponse({
      success: true,
      message: "Berhasil menggambil data",
      data: {
        totalRevenue,
        totalOrders,
        activeProductions,
        paidPayments
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
