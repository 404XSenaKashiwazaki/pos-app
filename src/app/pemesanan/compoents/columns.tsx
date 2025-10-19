"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit2Icon,
  SearchCheck,
  Trash2Icon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import { toast } from "sonner";
import { useModal } from "@/components/providers/Modal-provider";

import { ColumnOrderTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import { deleteOrder } from "../actions";
import { Customer, SablonType, User } from "@prisma/client";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { useSheet } from "@/components/providers/Sheet-provider";
import { IconShoppingCartPlus } from "@tabler/icons-react";

interface CellActionProps {
  row: Row<ColumnOrderTypeDefProps>;
  customer: Customer[];
  handle: User[];
  sablon: SablonType[];
}
const CellAction = ({ row, customer, handle, sablon }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const { modal, setOpen } = useModal();
  const { sheet } = useSheet();

  const deleteData = async () => {
    const id = row.original.id;
    if (!id) return;
    try {
      setLoading(true);
      const { success, message } = await deleteOrder(id);
      if (success)
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      setOpen(false);
    } finally {
      toast.error("Ops...")
      setLoading(false);
    }
  };

  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus pemesanan Anda secara permanen",
      body: (
        <>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size={"sm"}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button
              variant="destructive"
              size={"sm"}
              onClick={() => deleteData()}
            >
              <Trash2Icon />
              {loading ? "Memproses..." : "Hapus"}
            </Button>
          </div>
        </>
      ),
    });
  };
  console.log({row});
  

  const showModalEdit = () => {
    sheet({
      title: (
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconShoppingCartPlus className="h-4 w-4" />
          Form edit data pemesanan
        </span>
      ),
      description: "form untuk edit data pemesanan ",
      content: (
        <FormPage
          colorCount={String(row.original.items[0].colorCount) ?? ""}
          handleById={row.original.handledById ?? ""}
          printArea={String(row.original.items[0].printArea) ?? ""}
          sablonTypeId={row.original.items[0].production?.sablonTypeId ?? ""}
          sablon={sablon}
          handle={handle}
          customer={customer}
          id={row.original.id}
          orderNumber={row.original.orderNumber}
          productionDue={row.original.productionDue ?? ""}
          createdAt={row.original.createdAt ?? ""}
          address={row.original.customer.address ?? ""}
          phone={row.original.customer.phone ?? ""}
          name={row.original.customer.name ?? ""}
          color={row.original.items[0].color ?? ""}
          customerId={row.original.customerId}
          email={row.original.customer.email ?? ""}
          filename={row.original.designs[0].filename}
          notes={row.original.notes ?? ""}
          previewUrl={row.original.designs[0].previewUrl ?? ""}
          quantity={String(row.original.items[0].quantity) ?? ""}
          size={row.original.items[0].size ?? ""}
          status={row.original.status}
          totalAmount={row.original.totalAmount}
          unitPrice={row.original.items[0].unitPrice}
          product={row.original.items[0].product}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail pemesanan",
      body: <DetailPage id={row.original.id} />,
      description: "Detail data pemesanan ",
      size: "sm:max-w-2xl",
    });
  };

  return (
    <div className="flex gap-1 flex-col md:flex-row w">
      <Button variant="outline" size={"sm"} onClick={() => showModalDetail()}>
        <SearchCheck />
        Detail
      </Button>
      <Button variant="default" size={"sm"} onClick={() => showModalEdit()}>
        <Edit2Icon />
        Edit
      </Button>
      <Button
        variant="destructive"
        size={"sm"}
        onClick={() => showModalDelete()}
      >
        <Trash2Icon />
        Hapus
      </Button>
    </div>
  );
};

export const columns = ({
  customer,
  handle,
  sablon,
}: {
  customer: Customer[];
  handle: User[];
  sablon: SablonType[];
}): ColumnDef<ColumnOrderTypeDefProps>[] => [
  {
    id: "select",
    header: () => <div>No</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    id: "name",
    accessorFn: (row: ColumnOrderTypeDefProps) => row.customer.name ?? "",
    header: () => <div>Nama pemesan</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },

  {
    accessorKey: "product",
    accessorFn: (row: ColumnOrderTypeDefProps) => row.items[0].product ?? "",
    cell: (info) => info.getValue(),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produk/barang
          <ArrowUpDown />
        </Button>
      );
    },
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal pesan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("createdAt"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "productionDue",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal selesai
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("productionDue"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{formatCurrency(row.getValue("totalAmount"))}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => (
      <CellAction
        row={row}
        customer={customer}
        sablon={sablon}
        handle={handle}
      />
    ),
  },
];
