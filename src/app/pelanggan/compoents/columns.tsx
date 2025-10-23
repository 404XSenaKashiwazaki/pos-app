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

import { ColumnPelangganDefProps } from "@/types/datatable";
import FormCustomer from "./form";
import DetailCustomer from "./detail";
import { deleteCustomer } from "../actions";

const CellAction = ({ row }: { row: Row<ColumnPelangganDefProps> }) => {
  const [loading, setLoading] = useState(false);
  const { modal, setOpen } = useModal();

  const deleteData = async () => {
    const id = row.original.id;
    if (!id) return;
    try {
      setLoading(true);
      const { success, message, error } = await deleteCustomer(id);
      if (success) {
        setLoading(false);
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }

      if (error) {
        setLoading(false);
        toast.error("Ops...");
      }
    } finally {
      setLoading(false);
    }
  };

  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus pelanggan Anda secara permanen",
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
      title: "Edit data pelanggan",
      body: (
        <FormCustomer
          id={row.original.id}
          phone={row.original.phone}
          notes={row.original.notes}
          address={row.original.address}
          name={row.original.name}
          email={row.original.email}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data pelanggan",
      body: <DetailCustomer id={row.original.id} />,
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

export const columns = (): ColumnDef<ColumnPelangganDefProps>[] => [
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
    accessorFn: (row: ColumnPelangganDefProps) => row.name ?? "",
    header: () => <div>Nama</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No hp
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} />,
  },
];
