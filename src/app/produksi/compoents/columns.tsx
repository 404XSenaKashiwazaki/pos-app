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

import { ColumnProductionTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import { deleteProduction } from "../actions";
import { Customer, Prisma, SablonType, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { IconCreditCardPay, IconMoneybagPlus } from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";

interface CellActionProps {
  row: Row<ColumnProductionTypeDefProps>;
  handle: User[];
  sablon: SablonType[];
}

const CellAction = ({ row, handle, sablon }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const { modal, setOpen } = useModal();
  const { sheet } = useSheet();

  const deleteData = async () => {
    const id = row.original.id;
    if (!id) return;
    try {
      setLoading(true);
      const { success, message, error } = await deleteProduction(id);
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
    } catch (error) {
      setLoading(false);
      toast.error("Ops...");
    }
  };

  const showModalDelete = () => {
    modal({
      title: "Apakah kamu benar-benar yakin?",
      description:
        "Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus produksi Anda secara permanen",
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
              disabled={loading ? true : false}
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
    sheet({
      title: (
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconCreditCardPay className="h-4 w-4" />
          Form edit data produksi
        </span>
      ),
      description: "form untuk edit data produksi ",
      content: (
        <FormPage
          handle={handle}
          sablon={sablon}
          id={row.original.id}
          orderItemId={row.original.orderItemId}
          assignedToId={row.original.assignedToId ?? ""}
          endDate={row.original.endDate ?? ""}
          startDate={row.original.startDate ?? ""}
          notes={row.original.notes ?? ""}
          progress={String(row.original.progress)}
          sablonTypeId={row.original.sablonTypeId ?? ""}
          status={row.original.status}
          fileProofUrl={row.original.fileProofUrl ?? undefined}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data produksi",
      body: <DetailPage id={row.original.id} />,
      description: "Detail data produksi",
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
      {/* <Button
        variant="destructive"
        size={"sm"}
        onClick={() => showModalDelete()}
      >
        <Trash2Icon />
        Hapus
      </Button> */}
    </div>
  );
};

export const columns = ({
  handle,
  sablon,
}: {
  handle: User[];
  sablon: SablonType[];
}): ColumnDef<ColumnProductionTypeDefProps>[] => [
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
    accessorFn: (row: ColumnProductionTypeDefProps) =>
      row.assignedTo?.name ?? "",
    header: () => <div>Yang mengerjakan</div>,
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
      <div className="capitalize">{row.original.orderItem.product}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal pengerjaan
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("startDate"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "endDate",
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
      <div className="">{format(row.getValue("endDate"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>Type sablon</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.sablonType?.name}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.status}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction handle={handle} sablon={sablon} row={row} />,
  },
];
