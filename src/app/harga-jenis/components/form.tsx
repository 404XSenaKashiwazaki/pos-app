"use client";
import React, { useRef, useState } from "react";
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
import { formHargaJenisSchema } from "@/types/zod";
import { toast } from "sonner";
import { FormHargaJenisValue } from "@/types/form";
import { addHargaJenis, updateHargaJenis } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

const FormHargaJenis = ({
  id,
  name,
  basePrice,
  description,
  isActive,
  pricePerArea,
  pricePerColor,
  notes,
}: Partial<FormHargaJenisValue>) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formHargaJenisSchema>>({
    resolver: zodResolver(formHargaJenisSchema),
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
      basePrice: basePrice ?? "",
      pricePerColor: pricePerColor ?? "",
      // pricePerArea: pricePerArea ?? "",
      notes: notes ?? "",
      isAtive: isActive ?? true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formHargaJenisSchema>) => {
    console.log({ values });
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("description", values.description);
    formData.set("basePrice", values.basePrice);
    formData.set("pricePerColor", values.pricePerColor);
    // formData.set("pricePerArea",values.pricePerArea)
    formData.set("notes", values.notes ?? "");
    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateHargaJenis(id, formData)
        : await addHargaJenis(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (error) toast.error("Ops..");
    } catch (error) {
      toast.error("Ops...");
    } finally {
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      disabled={loading}
                      placeholder="Masukan nama"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="basePrice"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga awal</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      disabled={loading}
                      placeholder="Masukan harga awal"
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
              name="pricePerColor"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga per warna</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      disabled={loading}
                      placeholder="Masukan harga per warna"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="pricePerArea"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga per area</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan harga per area"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Deskripsi </FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan deskripsi"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Catatan</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    disabled={loading}
                    placeholder="Masukan catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex md:flex-row flex-col justify-end gap-2 mt-5">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              <X />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="destructive"
              size={"sm"}
            >
              {loading ? (
                <div className="flex gap-1 items-center">
                  <Spinner className="size-3" />
                  Loading...
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <SaveAllIcon /> Simpan
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormHargaJenis;
