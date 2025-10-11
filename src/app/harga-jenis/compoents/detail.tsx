"use client";
import { Calendar, DollarSign, PhoneCall, Tag, User2Icon } from "lucide-react";
import {
  IconAddressBook,
  IconBuilding,
  IconBuildingStore,
  IconMail,
  IconNotebook,
  IconPackage,
  IconPencil,
  IconPhone,
  IconUserCircle,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { SablonType } from "@prisma/client";
import { getHargaJenisById } from "../queries";

interface DetailHargaJenisProps {
  id: string | null;
}

const DetailHargaJenis = ({ id }: DetailHargaJenisProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<SablonType | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getHargaJenisById(id);
        setData(data ?? null);
      }
    });
  }, []);


  if (!data) return null;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconUserCircle className="h-4 w-4" />
          Data Pelanggan
        </span>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPencil className="h-4 w-4" />
            Nama:
          </span>
          <span className="font-medium text-primary">
            {data.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPhone className="h-4 w-4" />
            No hp:
          </span>
          <span className="font-medium text-primary">
            {Number(data.basePrice) ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMail className="h-4 w-4" />
            Email:
          </span>
          <span className="font-medium text-primary">
            {Number(data.pricePerColor) ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconAddressBook className="h-4 w-4" />
            Alamat:
          </span>
          <span className="font-medium text-primary">
            {Number(data.pricePerArea) ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconNotebook className="h-4 w-4" />
            Catatan:
          </span>
          <span className="font-medium text-primary">
            {data.notes ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailHargaJenis;
