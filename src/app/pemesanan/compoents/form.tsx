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
import { formCustomerSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCustomerValue } from "@/types/form";
import { addCustomer, updateCustomer } from "../actions";
import { Textarea } from "@/components/ui/textarea";

const FormCustomer = ({
  id,
  name,
  email,
  phone,
  address,
  notes,
}: Partial<FormCustomerValue>) => {
  const isProcessing = useRef(false);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useModal();
  const form = useForm<z.infer<typeof formCustomerSchema>>({
    resolver: zodResolver(formCustomerSchema),
    defaultValues: {
      name: name ?? "",
      phone: phone ?? "",
      email: email ?? "",
      address: address ?? "",
      notes: notes ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formCustomerSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => formData.append(key, val));
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
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
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>No hp</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Masukan no hp"
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
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="w-full"
                    placeholder="Masukan email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan alamat"
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

export default FormCustomer;
