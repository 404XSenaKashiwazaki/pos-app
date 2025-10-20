"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import { formPaymentSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addPayment, updatePayment } from "../actions";
import { useSheet } from "@/components/providers/Sheet-provider";
import DateInput from "@/components/DateInput";
import {
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  Prisma,
} from "@prisma/client";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { formatCurrency } from "@/lib/formatCurrency";
import { Textarea } from "@/components/ui/textarea";

interface FormOrderProps {
  id?: string | null;
  orders: Prisma.OrderGetPayload<{
    include: { customer: true; items: true; payments: true };
  }>[];
}

const paymentType: string[] = Object.values(PaymentType);
const paymentStatus: string[] = Object.values(PaymentStatus);
const paymentMethod: string[] = Object.values(PaymentMethod);

const FormPage = ({
  id,
  orders,
  amount,
  method,
  orderId,
  paidAt,
  reference,
  status,
  type,
  notes,
}: Partial<z.infer<typeof formPaymentSchema>> & FormOrderProps) => {
  const [remainingPayment, setRemainingPayment] = useState<
    string | number | null
  >();
  const [paymentTotal, setPaymentTotal] = useState<string | number | null>();
  const [preview, setPreview] = useState<string | null>(
    (reference as string) ?? null
  );

  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const form = useForm<z.infer<typeof formPaymentSchema>>({
    resolver: zodResolver(formPaymentSchema),
    defaultValues: {
      amount: amount ?? "",
      method: method ?? "",
      paidAt: paidAt ? new Date(paidAt) : new Date().toISOString(),
      orderId: orderId ?? "",
      reference: reference ?? "",
      status: status ?? "",
      type: type ?? "",
      notes: notes ?? ""
    },
  });

  const onSubmit = async (values: z.infer<typeof formPaymentSchema>) => {
    const formData = new FormData();

    formData.append("orderId", values.orderId);
    formData.append("paidAt", new Date(values.paidAt ?? "").toISOString());
    formData.append("amount", values.amount);
    formData.append("method", values.method);
    formData.append("type", values.type);
    formData.append("status", values.status);
    formData.append("reference", values.reference);
    formData.append("notes",values.notes ?? "")
    try {
      setLoading(true);
      const { success, message } = id
        ? await updatePayment(id, formData)
        : await addPayment(formData);
      if (success) {
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
        setLoading(false);
        setOpen(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Opsss.....");
    }
  };

  const findCustomerProduct = (id: string) =>
    orders.find((e) => String(e.id) === id);

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-5 w-full">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pemesan dan produk pesanan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("orderId", value);
                      const getCountAmount = findCustomerProduct(value);
                      const amountTotal = getCountAmount?.totalAmount;
                      if (getCountAmount?.payments.length !== 0) {
                        const totalRemainingPayment =
                          getCountAmount?.payments?.reduce(
                            (sum, payment) =>
                              sum + (Number(payment.amount) ?? 0),
                            0
                          );
                        const amountRemaining =
                          Number(amountTotal) - Number(totalRemainingPayment);
                        setRemainingPayment(amountRemaining);

                        form.setValue("amount", String(amountRemaining) ?? "");
                      } else {
                        form.setValue("amount", String(amountTotal) ?? "");
                        setRemainingPayment(amountTotal);
                      }
                      setPaymentTotal(amountTotal);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pemesan dan produk yang dipesan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.customer.name} - {e.items[0].product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  <FormDescription>
                    Untuk mengisi form pembayaran, silahkan pilih pemesan
                    terlebih dahulu. Orderan/pemesanan yang sudah lunas tidak akan tampil.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 ">
            <div className="grid w-full max-w-sm items-center gap-0 m-0">
              <label
                htmlFor="remainingPayment"
                className="font-medium text-sm m-0"
              >
                Total tagihan pembayaran
              </label>
              <Input
                readOnly
                id="remainingPayment"
                className="mt-0.5 w-full"
                placeholder="Total tagihan"
                value={paymentTotal ?? ""}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-0 m-0">
              <label
                htmlFor="remainingPayment"
                className="font-medium text-sm m-0"
              >
                Sisa tagihan pembayaran
              </label>
              <Input
                readOnly
                id="remainingPayment"
                className="mt-0.5 w-full"
                placeholder="Sisa tagihan"
                value={remainingPayment ?? ""}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Total pembayaran</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="w-full "
                    placeholder="Total"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                <FormDescription>
                  Harap untuk mengisi total pembayaran sesuai sisa tagihan-
                  {remainingPayment
                    ? formatCurrency(Number(remainingPayment))
                    : ""}
                </FormDescription>
              </FormItem>
            )}
          />
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 ">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type pembayaran </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Type pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentType.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Metode pembayaran </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Metode pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethod.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status pembayaran</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Status pembayaran" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentStatus.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paidAt"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Tanggal pembayaran</FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1 mb-10">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Bukti pembayaran</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file ?? null);
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <Card className="rounded-sm w-full">
              <CardHeader>
                <CardTitle>Preview bukti pembayaran</CardTitle>
                <CardAction>
                  <Button
                    type="button"
                    disabled={preview ? false : true}
                    onClick={deleteFileImagePreview}
                    variant={"destructive"}
                  >
                    <Trash2Icon />
                    Hapus
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <Image
                    src={preview ?? previewImg}
                    alt="Preview desain file"
                    width={500}
                    height={500}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive min-h-[20px]" />
              </FormItem>
            )}
          />
          <div className="flex md:flex-row flex-col justify-end gap-2 mt-10 mb-6">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              disabled={loading ? true : false}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading ? true : false}
              size={"sm"}
            >
              <SaveAllIcon />
              {loading ? "Memproses..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPage;
