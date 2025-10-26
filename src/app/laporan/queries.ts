"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Customer, Order, OrderStatus, Prisma } from "@prisma/client";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { getOrders } from "../pemesanan/queries";
import { getCustomers } from "../pelanggan/queries";
import { ColumnOrderTypeDefProps } from "@/types/datatable";

export type ByStatusOrdersToCard = {
  status: OrderStatus;
  countCurrentMonth: number;
  countLastMonth: number;
  percent: number;
};
const statusOrders = Object.values(OrderStatus);

export const getOrdersStatus = async (
  status: string
): Promise<
  Response<
    Prisma.OrderGetPayload<{
      include: { customer: true; items: true; payments: true };
    }>[]
  >
> => {
  console.log({ status });

  try {
    const resAll = await prisma.order.findMany({
      where: {
        status: (status as OrderStatus) || OrderStatus.PENDING,
      },
      include: { customer: true, items: true, payments: true },
    });
    if (!resAll)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pemesanan",
      });

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: resAll,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pemesanan",
    });
  }
};
export const getByStatusOrdersToCard = async (): Promise<
  Response<ByStatusOrdersToCard[]>
> => {
  const now = new Date();
  const startThisMonth = startOfMonth(now);
  const endThisMonth = endOfMonth(now);
  const lastMonthDate = subMonths(now, 1);
  const startLastMonth = startOfMonth(lastMonthDate);
  const endLastMonth = endOfMonth(lastMonthDate);

  try {
    const resAll = await Promise.all(
      statusOrders.map(async (status) => {
        const [countCurrentMonth, countLastMonth] = await Promise.all([
          prisma.order.count({
            where: {
              status,
              createdAt: {
                gte: startThisMonth,
                lte: endThisMonth,
              },
            },
          }),
          prisma.order.count({
            where: {
              status,
              createdAt: {
                gte: startLastMonth,
                lte: endLastMonth,
              },
            },
          }),
        ]);
        let percent = 0;
        if (countLastMonth === 0) {
          percent = countCurrentMonth > 0 ? 100 : 0;
        } else {
          percent =
            ((countCurrentMonth - countLastMonth) / countLastMonth) * 100;
        }

        return {
          status,
          countCurrentMonth,
          countLastMonth,
          percent: Number(percent.toFixed(1)),
        };
      })
    );
    return sendResponse({
      success: true,
      message: "Berhasil",
      data: resAll,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};

export interface getByStatusOrdersToCartRes {
  date: string;
  pending: number;
  confirmed: number;
  processing: number;
  printing: number;
  finishing: number;
  completed: number;
  cancelled: number;
  on_hold: number;
}
export const getByStatusOrdersToCart = async (): Promise<
  Response<getByStatusOrdersToCartRes[]>
> => {
  const stats: Record<string, getByStatusOrdersToCartRes> = {};
  const statusMap: Record<OrderStatus, keyof getByStatusOrdersToCartRes> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    PRINTING: "printing",
    FINISHING: "finishing",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
    ON_HOLD: "on_hold",
  };
  try {
    const orders = await prisma.order.findMany({
      select: {
        status: true,
        createdAt: true,
      },
    });

    for (const order of orders) {
      const date = order.createdAt.toISOString().split("T")[0];

      if (!stats[date]) {
        stats[date] = {
          date,
          pending: 0,
          confirmed: 0,
          processing: 0,
          printing: 0,
          finishing: 0,
          completed: 0,
          cancelled: 0,
          on_hold: 0,
        };
      }

      const key = statusMap[order.status];
      (stats[date][key] as number) += 1;
    }

    return sendResponse({
      success: true,
      message: "Berhasil",
      data: Object.values(stats).sort((a, b) => (a.date > b.date ? 1 : -1)),
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};


export const getByStatusPayment = async () => {};

export type GetAllStatusOrdersTable = {
  orders: ColumnOrderTypeDefProps[];
  customers: Customer[];
};
export const getAllStatusOrdersTable = async (): Promise<
  Response<GetAllStatusOrdersTable>
> => {
  const { data } = await getOrders();
  const { data: customer } = await getCustomers();

  try {
    return sendResponse({
      success: true,
      message: "Berhasil",
      data: {
        orders: data ?? [],
        customers: customer ?? [],
      },
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};
