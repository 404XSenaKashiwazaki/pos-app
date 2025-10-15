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
import { Customer } from "@prisma/client";

interface CellActionProps {
 row: Row<ColumnOrderTypeDefProps>  
 customer: Customer[]
}

const CellAction = ({ row, customer }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const { modal, setOpen } = useModal();

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
      setLoading(false);
    }
  };

  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus pembayaran Anda secara permanen",
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

  const showModalEdit = () => {
    modal({
      title: "Edit data pembayaran",
      body: (
        <FormPage
          id={row.original.id}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data pembayaran",
      body: <DetailPage id={row.original.id} />,
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

export const columns = ({ customer }: { customer: Customer[] }): ColumnDef<ColumnOrderTypeDefProps>[] => [
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("product")}</div>
    ),
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
      <div className="">{row.getValue("createdAt")}</div>
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
      <div className="">{row.getValue("productionDue")}</div>
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
      <div className="">{row.getValue("totalAmount")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} customer={customer} />,
  },
];
