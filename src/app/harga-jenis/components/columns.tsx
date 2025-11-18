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

import React from "react";
import { useModal } from "@/components/providers/Modal-provider";
import { ColumnSablonTypeDefProps } from "@/types/datatable";
import FormHargaJenis from "./form";
import DetailHargaJenis from "./detail";
import DeleteModal from "./delete";

const CellAction = ({ row }: { row: Row<ColumnSablonTypeDefProps> }) => {
  const { modal, setOpen } = useModal();
  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data Harga & Jenis Anda secara permanen",
      body: <DeleteModal id={row.original.id} setOpen={setOpen} />,
    });
  };

  const showModalEdit = () => {
    modal({
      title: "Edit data harga & jenis",
      body: (
        <FormHargaJenis
          id={row.original.id}
          basePrice={row.original.basePrice}
          description={row.original.description}
          isActive={row.original.isActive}
          name={row.original.name}
          notes={row.original.notes}
          pricePerArea={row.original.pricePerArea}
          pricePerColor={row.original.pricePerColor}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data harga & jenis",
      body: <DetailHargaJenis id={row.original.id} />,
      size: "max-w-md"
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

export const columns = (): ColumnDef<ColumnSablonTypeDefProps>[] => [
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
    accessorFn: (row: ColumnSablonTypeDefProps) => row.name ?? "",
    header: () => <div>Nama</div>,
    cell: (info) => info.getValue(),
    filterFn: (row, id, filterValue: string) => {
      const nama = row.getValue<string>(id);
      return nama.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    accessorKey: "basePrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Harga dasar
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="">{row.getValue("basePrice")}</div>,
  },

  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} />,
  },
];
