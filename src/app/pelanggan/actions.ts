"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formCustomerSchema } from "@/types/zod";
import { Customer } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addCustomer = async (
  formdata: FormData
): Promise<Response<Customer>> => {
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
  };

  const parseData = formCustomerSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pelanggan",
      error: parseData.error,
    });
  const { data } = parseData;
  try {
    const res = await prisma.customer.create({
      data: { ...data },
    });
    revalidatePath("/pelanggan");
    return sendResponse({
      success: true,
      message: "Berhasil menambahkan data pelanggan",
      data: res,
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menambahkan data pelanggan",
    });
  }
};

export const updateCustomer = async (id: string, formdata: FormData) => {
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
  };

  const parseData = formCustomerSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pelanggan",
      error: parseData.error,
    });
  try {
    const customerInDb = await prisma.customer.findUnique({ where: { id } });
    if (!customerInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data pelanggan",
      });
    const { data } = parseData;
    await prisma.customer.update({ data: { ...data }, where: { id } });
    revalidatePath("/pelanggan");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data pelanggan",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal mengupdate data pelanggan",
    });
  }
};
export const deleteCustomer = async (
  id: string
): Promise<Response<Customer>> => {
  try {
    const customerInDb = await prisma.customer.findUnique({ where: { id } });
    if (!customerInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data c",
      });
    await prisma.customer.delete({ where: { id } });
    revalidatePath("pelanggan");
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data c",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data c",
    });
  }
};
