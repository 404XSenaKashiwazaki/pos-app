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
  IconShield,
  IconShieldExclamation,
  IconUserCircle,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Customer, User } from "@prisma/client";
import { getUsersById } from "../queries";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<User | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getUsersById(id);
        setData(data ?? null);
      }
    });
  },[]);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))

  if (!data) return null;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconUserCircle className="h-4 w-4" />
          Data User
        </span>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPencil className="h-4 w-4" />
            Nama:
          </span>
          <span className="font-medium text-primary">{data.name ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMail className="h-4 w-4" />
            Email:
          </span>
          <span className="font-medium text-primary">{data.email ?? "-"}</span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconShieldExclamation className="h-4 w-4" />
            Level:
          </span>
          <span className="font-medium text-primary">{data.role ?? "-"}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
