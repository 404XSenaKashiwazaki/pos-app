"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formCustomerSchema } from "@/types/zod";
import { Customer, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addUser = async (
  formdata: FormData
): Promise<Response<Customer>> => {
  // const parseData = formCustomerSchema.safeParse(
  //   Object.entries(formdata).map(([key]) => formdata.get(key))
  // );

  // if (!parseData.success)
  //   return sendResponse({
  //     success: false,
  //     message: "Gagal mendapatkan data customer",
  //     error: parseData.error,
  //   });
  // const { data } = parseData;
  try {
    // const res = await prisma.customer.create({
    //   data: { ...data },
    // });
    revalidatePath("/pelanggan");
    return sendResponse({
      success: true,
      message: "Berhasil menambahkan data customer",
      // data: res,
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menambahkan data customer",
    });
  }
};

export const updateUser = async (id: string, formdata: FormData) => {
  const parseData = formCustomerSchema.safeParse(
    Object.entries(formdata).map(([key]) => formdata.get(key))
  );

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data customer",
      error: parseData.error,
    });
  try {
    const userInDb = await prisma.customer.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data customer",
      });
    const { data } = parseData;
    await prisma.customer.update({ data: { ...data }, where: { id } });
    revalidatePath("/pelanggan");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data customer",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal mengupdate data customer",
    });
  }
};
export const deleteUser = async (id: string): Promise<Response<User>> => {
  try {
    const userInDb = await prisma.user.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
    await prisma.user.delete({ where: { id } });
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data user",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data user",
    });
  }
};
