"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import { formCustomerSchema, formOrderSchema } from "@/types/zod";
import { Customer, Order, OrderStatus } from "@prisma/client";
import { existsSync } from "fs";
import { unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const addOrder = async (
  formdata: FormData
): Promise<Response<Order>> => {
  const currentLogin = await auth();
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
    customerId: formdata.get("customerId"),
    product: formdata.get("product"),
    color: formdata.get("color"),
    filename: formdata.get("filename"),
    status: formdata.get("status"),
    createdAt: formdata.get("createdAt"),
    unitPrice: formdata.get("unitPrice"),
    quantity: formdata.get("quanatity"),
    totalAmount: formdata.get("totalAmount"),
    orderNumber: formdata.get("orderNumber"),
    size: formdata.get("size"),
    productionDue: formdata.get("productionDue"),
    handleById: formdata.get("handleById"),
    sablonTypeId: formdata.get("sablonTypeId"),
    colorCount: formdata.get("colorCount"),
    printArea: formdata.get("printArea"),
  };

  const parseData = formOrderSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pemesanan",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";
  let filePreview = "";
  if (file) {
    const fileUpload = await uploadFile(file, "uploads");
    fileName = fileUpload.fileName;
    fileUrl = fileUpload.fileUrl;
    filePreview = fileUpload.fileUrl;
  } else {
    fileName = process.env.PREVIEW_IMAGE as string;
    fileUrl = process.env.PREVIEW_IMAGE_URL as string;
  }

  try {
    await prisma.order.create({
      data: {
        customerId: data.customerId,
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        createdAt: data.createdAt,
        createdById: currentLogin?.user.id,
        notes: data.notes,
        status: (data.status as OrderStatus) || OrderStatus.PENDING,
        productionDue: data.productionDue,
        handledById: data.handleById,
        items: {
          create: {
            product: data.product,
            subtotal: data.totalAmount,
            unitPrice: data.unitPrice,
            color: data.color,
            notes: data.notes,
            quantity: Number(data.quantity),
            size: data.size,
            printArea: data.printArea,
            colorCount: Number(data.colorCount),
            production: {
              create: {
                assignedToId: data.handleById,
                sablonTypeId: data.sablonTypeId,
                endDate: data.productionDue,
                startDate: data.createdAt,
              },
            },
          },
        },
        designs: {
          create: {
            filename: fileName,
            fileUrl: fileUrl,
            previewUrl: fileUrl,
            uploadedBy: currentLogin?.user.id,
          },
        },
      },
    });
    revalidatePath("/pemesanan");
    return sendResponse({
      success: true,
      message: "Berhasil menambahkan data pemesanan",
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
      message: "Gagal menambahkan data pemesanan",
    });
  }
};

export const updateOrder = async (
  id: string,
  formdata: FormData
): Promise<Response<Order>> => {
  const currentLogin = await auth();
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
    customerId: formdata.get("customerId"),
    product: formdata.get("product"),
    color: formdata.get("color"),
    filename: formdata.get("filename"),
    status: formdata.get("status"),
    createdAt: formdata.get("createdAt"),
    unitPrice: formdata.get("unitPrice"),
    quantity: formdata.get("quanatity"),
    totalAmount: formdata.get("totalAmount"),
    orderNumber: formdata.get("orderNumber"),
    size: formdata.get("size"),
    productionDue: formdata.get("productionDue"),
    handleById: formdata.get("handleById"),
    sablonTypeId: formdata.get("sablonTypeId"),
    colorCount: formdata.get("colorCount"),
    printArea: formdata.get("printArea"),
  };

  const parseData = formOrderSchema.safeParse(raw);
  console.log({ parseData: parseData.error });

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pemesanan",
      error: parseData.error,
    });
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";
  const dataInDb = await prisma.order.findUnique({
    where: { id },
    include: { items: true, designs: true },
  });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pemesanan",
    });
  try {
    const { data } = parseData;
    if (!file) {
      fileName = dataInDb.designs[0].filename;
      fileUrl = dataInDb.designs[0].fileUrl;
    } else {
      const filePath = getFilePath(dataInDb.designs[0].fileUrl);
      const fileUpload = await uploadFile(file, "uploads");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.designs[0].filename !==
          (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    }

    await prisma.$transaction([
      prisma.order.update({
        data: {
          customerId: data.customerId,
          orderNumber: data.orderNumber,
          totalAmount: data.totalAmount,
          createdAt: data.createdAt,
          createdById: currentLogin?.user.id,
          notes: data.notes,
          status: (data.status as OrderStatus) || OrderStatus.PENDING,
          productionDue: data.productionDue,
          handledById: data.handleById,
          designs: {
            update: {
              where: { id: dataInDb.designs[0].id },
              data: {
                filename: fileName,
                fileUrl: fileUrl,
                previewUrl: fileUrl,
                uploadedBy: currentLogin?.user.id,
              },
            },
          },
          items: {
            update: {
              where: { id: dataInDb.items[0].id },
              data: {
                product: data.product,
                subtotal: data.totalAmount,
                unitPrice: data.unitPrice,
                color: data.color,
                notes: data.notes,
                quantity: Number(data.quantity),
                size: data.size,
                printArea: data.printArea,
                colorCount: Number(data.colorCount),
                production: {
                  update: {
                    data: {
                      assignedToId: data.handleById,
                      sablonTypeId: data.sablonTypeId,
                      endDate: data.productionDue,
                      startDate: data.createdAt,
                    },
                    where: {
                      orderItemId: dataInDb.items[0].id,
                    },
                  },
                },
              },
            },
          },
        },
        where: { id },
      }),
    ]);
    revalidatePath("/pemesanan");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data pemesanan",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.designs[0].filename !==
          (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal mengupdate data pemesanan",
    });
  }
};
export const deleteOrder = async (id: string): Promise<Response<Order>> => {
  try {
    const dataInDb = await prisma.order.findUnique({
      where: { id },
      include: { designs: true, payments: true },
    });
    console.log({ dataInDb });

    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data order",
      });
    const filePath = getFilePath(dataInDb.designs[0].fileUrl);
    await prisma.order.delete({ where: { id } });

    if (
      dataInDb.designs[0].filename !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    revalidatePath("pemesanan");
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data order",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data order",
    });
  }
};
