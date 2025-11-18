"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  SearchCheck,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnUserDefProps } from "@/types/datatable";
import FormCustomer from "./form";
import DetailCustomer from "./detail";
import DeleteModal from "./delete";

const CellAction = ({ row }: { row: Row<ColumnUserDefProps> }) => {
  const { modal, setOpen } = useModal();

  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus user Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen}/>
    });
  };

  const showModalEdit = () => {
    modal({
      title: "Edit data user",
      body: <FormCustomer />,
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data user",
      body: <DetailCustomer id={row.original.id} />,
    });
  };

  return (
    <div className="flex gap-1 flex-col md:flex-row w">
      <Button variant="outline" size={"sm"} onClick={() => showModalDetail()}>
        <SearchCheck />
        Detail
      </Button>
      {/* <Button variant="default" size={"sm"} onClick={() => showModalEdit()}>
        <Edit2Icon />
        Edit
      </Button> */}
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

export const columns = (): ColumnDef<ColumnUserDefProps>[] => [
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
    accessorFn: (row: ColumnUserDefProps) => row.name ?? "",
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
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("email")}</div>
    ),
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} />,
  },
];
