import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatCurrency";
import { Prisma } from "@prisma/client";
import { IconReport } from "@tabler/icons-react";
import { format } from "date-fns";

interface TableStatusOrderProps {
  status: string;
  data: Prisma.OrderGetPayload<{
    include: { customer: true; items: true; payments: true };
  }>[];
}

const TableStatusOrder = ({ status, data }: TableStatusOrderProps) => {
  const total = data.reduce((acc, curr) => acc + Number(curr.totalAmount), 0);
  return (
    <div>
      <div>
        <Button variant="default" aria-label="Submit" disabled={data.length == 0 ? true : false }>
          <IconReport />
          Cetak PDF
        </Button>
      </div>
      <Table className="mb-3 md:mb-5">
        <TableCaption>
          Daftar Pemesanan berdasarkan status: {status}.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No Pesanan</TableHead>
            <TableHead>Pemesan</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.orderNumber}</TableCell>
              <TableCell>{d.customer.name}</TableCell>
              <TableCell>{d.items[0].product}</TableCell>
              <TableCell>{d.status}</TableCell>
              <TableCell>{format(d.createdAt, "PPP")}</TableCell>
              <TableCell>{d.items[0].quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(d.totalAmount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(total)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableStatusOrder;
