"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import {
  formCustomerSchema,
  formPaymentSchema,
  formProductionSchema,
} from "@/types/zod";
import {
  Customer,
  Order,
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Production,
  ProductionStatus,
} from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const updateProduction = async (
  id: string,
  formdata: FormData
): Promise<Response<Production>> => {
  const raw = {
    notes: formdata.get("notes"),
    assignedToId: formdata.get("assignedToId"),
    endDate: formdata.get("endDate"),
    orderItemId: formdata.get("orderItemId"),
    startDate: formdata.get("startDate"),
    progress: formdata.get("progress"),
    status: formdata.get("status"),
    sablonTypeId: formdata.get("sablonTypeId"),
  };

  const parseData = formProductionSchema.safeParse(raw);
  console.log({ parseData });

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";

  const dataInDb = await prisma.production.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data produksi",
    });
  if (!file) {
    fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl =
      dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.fileProofUrl ?? "");
      const fileUpload = await uploadFile(file, "payments");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.fileProofUrl !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl =
        dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
    }
  }
  try {
    await prisma.production.update({
      data: {
        orderItemId: data.orderItemId,
        status: (data.status as ProductionStatus) || ProductionStatus.WAITING,
        assignedToId: data.assignedToId,
        startDate: data.startDate,
        endDate: data.endDate,
        sablonTypeId: data.sablonTypeId,
        progress: Number(data.progress),
        fileProofUrl: fileUrl,
        notes: data.notes,
        filename: fileName,
      },
      where: {
        id,
      },
    });
    revalidatePath("/productions");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data produksi",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      fileName !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      console.log("remove file");
      await removeFile(filePath);
    }
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal mengupdate data produksi",
    });
  }
};

export const updatePayment = async (
  id: string,
  formdata: FormData
): Promise<Response<Payment>> => {
  const raw = {
    notes: formdata.get("notes"),
    orderId: formdata.get("orderId"),
    paidAt: formdata.get("paidAt"),
    amount: formdata.get("amount"),
    method: formdata.get("method"),
    type: formdata.get("type"),
    status: formdata.get("status"),
    reference: formdata.get("reference"),
  };

  const parseData = formPaymentSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("reference") as File | null;
  let fileName = "";
  let fileUrl = "";
  const dataInDb = await prisma.payment.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pembayaran",
    });
  if (!file) {
    fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl = dataInDb.reference ?? (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.reference ?? "");
      const fileUpload = await uploadFile(file, "payments");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.reference !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl = dataInDb.reference ?? (process.env.PREVIEW_IMAGE_URL as string);
    }
  }

  try {
    await prisma.payment.update({
      data: {
        amount: data.amount,
        orderId: data.orderId,
        method: (data.method as PaymentMethod) || PaymentMethod.CASH,
        type: (data.type as PaymentType) || PaymentType.DP,
        status: (data.status as PaymentStatus) || PaymentStatus.PAID,
        paidAt: data.paidAt,
        reference: fileUrl,
        filename: fileName,
      },
      where: { id },
    });
    revalidatePath("/pembayaran");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data pembayaran",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.reference !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal mengupdate data pembayaran",
    });
  }
};
export const deletePayment = async (id: string): Promise<Response<Payment>> => {
  try {
    const dataInDb = await prisma.payment.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data payment",
      });
    await prisma.payment.delete({ where: { id } });
    const filePath = getFilePath(dataInDb.reference);
    if (
      dataInDb.filename !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    revalidatePath("pembayaran");
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data payment",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data payment",
    });
  }
};
