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
import { Skeleton } from "@/components/ui/skeleton";

interface DetailPageProps {
  id: string | null;
}

const DetailPage: React.FC<DetailPageProps> = ({ id }) => {
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
if(isPending) return <Skeleton className="w-full h-52" />
  if (!data) return <div >Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconUserCircle className="h-4 w-4" />
          Data Pelanggan
        </span>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Email
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1">
            <p>:</p>
            <p>{data.order.customer.email ?? "-"}</p>
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
