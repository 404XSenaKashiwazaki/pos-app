"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import { Customer } from "@prisma/client";

export const getCustomers = async (): Promise<Response<Customer[]>> => {
  try {
    const res = await prisma.customer.findMany();
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data customer",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data customer",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data customer",
    });
  }
};



export const getCustomerById = async (id: string): Promise<Response<Customer>> => {
  if(!id) return sendResponse({
        success: false,
        message: "Gagal mendapatkan data customer",
      });
  try {
    const res = await prisma.customer.findUnique({ where: {id}});
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data customer",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data customer",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data customer",
    });
  }
};

