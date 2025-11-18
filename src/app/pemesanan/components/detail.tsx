"use client";
import {
  IconAddressBook,
  IconMail,
  IconPencil,
  IconPhone,
} from "@tabler/icons-react";
import React, { useEffect, useState, useTransition } from "react";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Customer, Order, Prisma } from "@prisma/client";
import { getOrderById } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (isPending) return <Skeleton className="w-full h-52" />;
  if (!data) return <div>Tidak Ada Data.</div>;
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            Nama
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.customer.name ?? "-"}</p></span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
            No Hp
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.customer.phone ?? "-"}</p></span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
           Email
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.customer.email ?? "-"}</p></span>
        </div>
         <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
           Alamat
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.customer.address ?? "-"}</p></span>
        </div>
        <div className="flex flex-col sm:flex-row gap-1 items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground  w-full">
           Catatan
          </span>
          <span className="font-xs text-primary  w-full  flex items-start gap-1"><p>:</p><p>{data.notes ?? "-"}</p></span>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
