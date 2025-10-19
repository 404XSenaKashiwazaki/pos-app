"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { Response } from "@/types/response";
import { formProfileSchema } from "@/types/zod";
import { User } from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  id: string,
  formdata: FormData
): Promise<Response<User>> => {
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    address: formdata.get("address"),
    image: formdata.get("image"),
    imageUrl: formdata.get("imageUrl")
  };

  const parseData = formProfileSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pengaturan",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("image") as File | null;
  let fileName = "";
  let fileUrl = "";
  let filePreview = "";
  const dataInDb = await prisma.user.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data pengaturan",
    });
  if (!file) {
    fileName = dataInDb.image ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl = dataInDb.imageUrl ?? (data.imageUrl) ? data.imageUrl ?? "" : process.env.PREVIEW_IMAGE_URL as string;
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.imageUrl ?? "");
      const fileUpload = await uploadFile(file, "profiles");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      console.log({ dek:  dataInDb.image !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)});
      
      if (
        dataInDb.image !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.image ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl = dataInDb.imageUrl ?? (data.imageUrl) ? data.imageUrl ?? "" : process.env.PREVIEW_IMAGE_URL as string;
    }
  }

  try {
    const res = await prisma.user.update({
        data: {
            name: data.name,
            image: fileName,
            imageUrl: fileUrl,
            phone: data.phone,
            address: data.address
        },
        where: { id }
    })
    revalidatePath("/pengaturan");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data pengaturan",
      data: res
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.image !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal mengupdate data pengaturan",
    });
  }
};
