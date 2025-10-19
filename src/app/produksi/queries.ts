"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { ColumnProductionTypeDefProps } from "@/types/datatable";
import { Response } from "@/types/response";

export const getProductions = async (): Promise<
  Response<ColumnProductionTypeDefProps[]>
> => {
  try {
    const res = await prisma.production.findMany({
      include: {
        orderItem: true,
        assignedTo: true,
        sablonType: true,
      },
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pembayaran",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data pembayaran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};

export const getProductionById = async (
  id: string
): Promise<Response<ColumnProductionTypeDefProps>> => {
  if (!id)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  try {
    const res = await prisma.production.findUnique({
      where: { id },
      include: {
        orderItem: true,
        assignedTo: true,
        sablonType: true,
      },
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pembayaran",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data pembayaran",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  }
};
