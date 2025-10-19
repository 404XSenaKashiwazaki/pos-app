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
import { Customer } from "@prisma/client";
import { getCustomerById } from "../queries";

interface DetailPembelianProps {
  id: string | null;
}

const DetailCustomer = ({ id }: DetailPembelianProps) => {
  const [isPending, startTransition] = useTransition();
  const [customer, setCustomer] = useState<Customer | null>(null);
  useEffect(() => {
    startTransition(async () => {
      if (id) {
        const { data } = await getCustomerById(id);
        setCustomer(data ?? null);
      }
    });
  }, []);

  // const produk = pembelian?.detailpembelian.map(e=> ({...e.}))

  if (!customer) return null;
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
            {customer.name ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconPhone className="h-4 w-4" />
            No hp:
          </span>
          <span className="font-medium text-primary">
            {customer.phone ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconMail className="h-4 w-4" />
            Email:
          </span>
          <span className="font-medium text-primary">
            {customer.email ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconAddressBook className="h-4 w-4" />
            Alamat:
          </span>
          <span className="font-medium text-primary">
            {customer.address ?? "-"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <span className="flex items-center gap-1 text-muted-foreground">
            <IconNotebook className="h-4 w-4" />
            Catatan:
          </span>
          <span className="font-medium text-primary">
            {customer.notes ?? "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailCustomer;
