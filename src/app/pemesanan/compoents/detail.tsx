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
import { Customer, Order, Prisma } from "@prisma/client";
import { getOrderById } from "../queries";

interface DetailPembelianProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<Prisma.OrderGetPayload<{
    include: { customer: true; items: true; designs: true };
  }> | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getOrderById(id);
        setData(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))

  if (!data) return null;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPencil className="h-4 w-4" />
            Nama:
          </span>
          <span className="font-medium text-primary">
            {data.customer.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPhone className="h-4 w-4" />
            No hp:
          </span>
          <span className="font-medium text-primary">
            {data.customer.phone ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMail className="h-4 w-4" />
            Email:
          </span>
          <span className="font-medium text-primary">
            {data.customer.email ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconAddressBook className="h-4 w-4" />
            Alamat:
          </span>
          <span className="font-medium text-primary">
            {data.customer.address ?? "-"}
          </span>
        </div>
        <div className="flex items-center lex-col md:flex-row md:justify-between gap-1 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            Catatan:
          </span>
          <span className="font-medium text-primary">{data.notes ?? "-"}</span>
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

export default DetailPage;
