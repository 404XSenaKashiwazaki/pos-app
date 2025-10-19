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
import { Customer, Order } from "@prisma/client";
import { getPaymentById } from "../queries";
import { ColumnPaymentTypeDefProps } from "@/types/datatable";

interface DetailPageProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPageProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ColumnPaymentTypeDefProps | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getPaymentById(id);
        setData(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))


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
            {data.order.customer.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPhone className="h-4 w-4" />
            No hp:
          </span>
          <span className="font-medium text-primary">
            { "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMail className="h-4 w-4" />
            Email:
          </span>
          <span className="font-medium text-primary">
            { "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconAddressBook className="h-4 w-4" />
            Alamat:
          </span>
          <span className="font-medium text-primary">
            {"-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconNotebook className="h-4 w-4" />
            Catatan:
          </span>
          <span className="font-medium text-primary">
            {data.order.notes ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
