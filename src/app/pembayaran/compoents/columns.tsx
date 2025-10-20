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
import { ColumnPaymentTypeDefProps } from "@/types/datatable";
import FormPage from "./form";
import DetailPage from "./detail";
import { deletePayment } from "../actions";
import { Prisma } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { IconCreditCardPay } from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";

interface CellActionProps {
  row: Row<ColumnPaymentTypeDefProps>;
  orders: Prisma.OrderGetPayload<{
    include: { customer: true; items: true; payments: true };
  }>[];
}

const CellAction = ({ row, orders }: CellActionProps) => {
  const [loading, setLoading] = useState(false);
  const { modal, setOpen } = useModal();
  const { sheet } = useSheet();

  const deleteData = async () => {
    const id = row.original.id;
    if (!id) return;
    try {
      setLoading(true);
      const { success, message, error } = await deletePayment(id);
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
        toast.error(error.message);
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
          Form edit data pembayaran
        </span>
      ),
      description: "form untuk edit data pembayaran ",
      content: (
        <FormPage
          id={row.original.id}
          amount={row.original.amount}
          method={row.original.method}
          orderId={row.original.orderId}
          paidAt={row.original.paidAt ?? ""}
          reference={row.original.reference ?? ""}
          status={row.original.status ?? ""}
          type={row.original.type}
          orders={orders}
          notes={row.original.notes ?? ""}
        />
      ),
      size: "sm:max-w-2xl",
    });
  };

  const showModalDetail = () => {
    modal({
      title: "Detail data pembayaran",
      body: <DetailPage id={row.original.id} />,
      description: "Detail data pembayaran",
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
  orders,
}: Pick<CellActionProps, "orders">): ColumnDef<ColumnPaymentTypeDefProps>[] => [
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
    accessorFn: (row: ColumnPaymentTypeDefProps) =>
      row.order.customer.name ?? "",
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
      <div className="capitalize">{row.original.order.items[0].product}</div>
    ),
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal dibayar
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{format(row.getValue("paidAt"), "PPP")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div>Type </div>,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          <Badge variant={"default"}>{row.original.type}</Badge>
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
    accessorKey: "amount",
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
      <div className="">{formatCurrency(row.getValue("amount"))}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => <CellAction row={row} orders={orders} />,
  },
];
