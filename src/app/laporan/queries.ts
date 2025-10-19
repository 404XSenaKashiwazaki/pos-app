"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Customer, OrderStatus } from "@prisma/client";
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

export const getByStatusOrdersToCart = async () => {
  const now = new Date();

  try {
    return sendResponse({
      success: true,
      message: "Berhasil",
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
