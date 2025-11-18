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
import {
  ColumnPaymentTypeDefProps,
  ColumnProductionTypeDefProps,
} from "@/types/datatable";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!data) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Yang Mengerjakan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.assignedTo?.email ?? "-"}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Progress
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{`${data.progress} %`}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Tanggal Mulai
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{format(data.startDate ?? "", "PPP")}</p>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Tanggal Selesai
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{format(data.endDate ?? "", "PPP")}</p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Status
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>
              <Badge variant={"default"} className="w-4">
                {data.status}
              </Badge>
            </p>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Catatan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.notes ?? "-"}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
