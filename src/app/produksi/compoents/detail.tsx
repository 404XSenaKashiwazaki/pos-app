"use client";
import { Calendar, DollarSign, PhoneCall, Tag, User2Icon } from "lucide-react";
import {
  IconAddressBook,
  IconBuilding,
  IconBuildingStore,
  IconCalendar,
  IconMail,
  IconNotebook,
  IconPackage,
  IconPencil,
  IconPhone,
  IconProgress,
  IconUserCircle,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Customer, Order } from "@prisma/client";
import { getProductionById } from "../queries";
import { ColumnPaymentTypeDefProps, ColumnProductionTypeDefProps } from "@/types/datatable";

interface DetailPageProps {
  id: string | null;
}

const DetailPage = ({ id }: DetailPageProps) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<ColumnProductionTypeDefProps | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getProductionById(id);
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
            <IconUserCircle className="h-4 w-4" />
            Yang mengerjakan:
          </span>
          <span className="font-medium text-primary">
            {data.assignedTo?.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconProgress className="h-4 w-4" />
            Progress:
          </span>
          <span className="font-medium text-primary">
            {
              data.progress+"%"
            }
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconCalendar className="h-4 w-4" />
            Tanggal mulai:
          </span>
          <span className="font-medium text-primary">
            { format(data.startDate ?? "", "PPP") ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconCalendar className="h-4 w-4" />
            Tanggal selesai:
          </span>
          <span className="font-medium text-primary">
            { format(data.endDate ?? "", "PPP") ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconProgress className="h-4 w-4" />
            Status:
          </span>
          <span className="font-medium text-primary">
            {data.status ?? "-"}
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

export default DetailPage;
