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
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            Nama:
          </span>
          <span className="font-medium text-primary">{data.name ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            Harga dasar:
          </span>
          <span className="font-medium text-primary">
            {Number(data.basePrice) ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            Harga Per Warna :
          </span>
          <span className="font-medium text-primary">
            {Number(data.pricePerColor) ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            Deskripsi:
          </span>
          <span className="font-medium text-primary">
            {data.description ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            Catatan:
          </span>
          <span className="font-medium text-primary">{data.notes ?? "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailHargaJenis;
