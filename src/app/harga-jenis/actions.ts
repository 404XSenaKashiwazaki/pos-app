"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formHargaJenisSchema } from "@/types/zod";
import { Customer, SablonType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addHargaJenis = async (
  formdata: FormData
): Promise<Response<SablonType>> => {
  const raw = {
    name: formdata.get("name"),
    description: formdata.get("description"),
    basePrice: String(formdata.get("basePrice")),
    pricePerColor: String(formdata.get("pricePerColor")),
    pricePerArea: String(formdata.get("pricePerArea")),
    isActive: formdata.get("isActive") ? 1 : 0,
    notes: formdata.get("notes"),
  };

  const parseData = formHargaJenisSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data harga & jenis",
      error: parseData.error,
    });
  const { data } = parseData;
  try {
    const res = await prisma.sablonType.create({
      data: { ...data },
    });
    revalidatePath("/harga-jenis");
    return sendResponse({
      success: true,
      message: "Berhasil menambahkan data harga & jenis",
      data: res,
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menambahkan data harga & jenis",
    });
  }
};

export const updateHargaJenis = async (id: string, formdata: FormData) => {
  const raw = {
    name: formdata.get("name"),
    description: formdata.get("description"),
    basePrice: String(formdata.get("basePrice")),
    pricePerColor: String(formdata.get("pricePerColor")),
    pricePerArea: String(formdata.get("pricePerArea")),
    isActive: formdata.get("isActive") ? 1 : 0,
    notes: formdata.get("notes"),
  };

  const parseData = formHargaJenisSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data harga & jenis",
      error: parseData.error,
    });
  try {
    const datanDb = await prisma.sablonType.findUnique({ where: { id } });
    if (!datanDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data harga & jenis",
      });
    const { data } = parseData;
    await prisma.sablonType.update({ data: { ...data }, where: { id } });
    revalidatePath("/harga-jenis");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data harga & jenis",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal mengupdate data harga & jenis",
    });
  }
};
export const deleteHargaJenis = async (
  id: string
): Promise<Response<SablonType>> => {
  try {
    const dataInDb = await prisma.sablonType.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data harga & jenis",
      });
    await prisma.sablonType.delete({ where: { id } });
    revalidatePath("harga-jenis")
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data harga & jenis",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data harga & jenis",
    });
  }
};
