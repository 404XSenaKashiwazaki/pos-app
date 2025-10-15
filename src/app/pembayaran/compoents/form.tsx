"use client";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useRef,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/providers/Modal-provider";
import { SaveAllIcon, X } from "lucide-react";
import { formPaymentSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCustomer, updateCustomer } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { IconCreditCardPay } from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";

interface FormOrderProps {
  id?: string | null;
}

const FormPage = ({
  id,
}: Partial<z.infer<typeof formPaymentSchema>> & FormOrderProps) => {
  const isProcessing = useRef(false);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const form = useForm<z.infer<typeof formPaymentSchema>>({
    resolver: zodResolver(formPaymentSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formPaymentSchema>) => {
    const formData = new FormData();

    try {
      setLoading(true);
      const { success, message } = id
        ? await updateCustomer(id, formData)
        : await addCustomer(formData);
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
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Total </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Total"
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Metode pembayaran"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Status"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Bukti pembayaran</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="w-full "
                      readOnly
                      placeholder="File gambar bukti pembayaran"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <div className="w-full">preview</div>
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="paidAt"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Tanggal pembayaran</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Tanggal pembarayan"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
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
          <div className="flex md:flex-row flex-col justify-end gap-2 mt-5">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button type="submit" variant="destructive" size={"sm"}>
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
