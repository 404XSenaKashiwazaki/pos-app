"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
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
import { useModal } from "@/components/providers/Modal-provider";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import { formProductionSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormCustomerValue } from "@/types/form";

import { Textarea } from "@/components/ui/textarea";
import {
  OrderStatus,
  ProductionStatus,
  SablonType,
  User,
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
import DateInput from "@/components/DateInput";
import { useSheet } from "@/components/providers/Sheet-provider";
import { updateProduction } from "../actions";
import { formatDateIDForm, toLocalDBFormat } from "@/lib/formatDateID";
const statusProduction: string[] = Object.values(ProductionStatus);

interface FormPageProps {
  handle: User[];
  sablon: SablonType[];
  id?: string | null;
  fileProofUrl?: string | null;
}
const FormPage = ({
  orderItemId,
  assignedToId,
  endDate,
  progress,
  sablonTypeId,
  startDate,
  status,
  filename,
  handle,
  sablon,
  id,
  notes,
  fileProofUrl,
}: Partial<z.infer<typeof formProductionSchema>> & FormPageProps) => {
  const [preview, setPreview] = useState<string | null>(fileProofUrl ?? null);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 15);
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const form = useForm<z.infer<typeof formProductionSchema>>({
    resolver: zodResolver(formProductionSchema),
    defaultValues: {
      orderItemId: orderItemId,
      assignedToId: assignedToId ?? "",
      endDate: endDate ? formatDateIDForm(endDate) : currentDate.toISOString(),
      progress: progress ?? "",
      startDate: startDate ? formatDateIDForm(startDate) : new Date().toISOString(),
      status: status ?? "",
      sablonTypeId: sablonTypeId ?? "",
      notes: notes ?? "",
      filename: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formProductionSchema>) => {
    const formData = new FormData();
    formData.append("assignedToId", values.assignedToId);
    formData.append("orderItemId", values.orderItemId);
    formData.append("endDate", toLocalDBFormat(new Date(values.endDate ?? "")).toISOString());
    formData.append(
      "startDate",
      toLocalDBFormat(new Date(values.startDate ?? "")).toISOString()
    );
    formData.append("progress", values.progress);
    formData.append("status", values.status);
    formData.append("sablonTypeId", values.sablonTypeId);
    formData.append("filename", values.filename ?? "");
    formData.append("notes", values.notes ?? "");
    if (!id) return;
    try {
      setLoading(true);
      const { success, message, error } = await updateProduction(id, formData);
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
        console.log({ error });

        toast.error("Ops...");
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
      toast.error("Ops...");
    }
  };

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  console.log({ form: form.formState });

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="sablonTypeId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type sablon</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih type sablon" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sablon.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
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
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status pemesanan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status pemesanan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusProduction.map((e) => (
                        <SelectItem key={e} value={e}>
                          {e}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Tanggal mulai</FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Tanggal selesai</FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                    <FormDescription className="text-sm text-muted-foreground">
                      Tanggal selesai otomatis + 15 hari dari tanggal pemesanan
                    </FormDescription>
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="assignedToId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Yang mengerjakan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih yang mengerjakan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {handle.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Progress</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Progress pengerjaan"
                      min={1}
                      max={100}
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
              name="filename"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Foto status pengerjaan</FormLabel>
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
                <CardTitle>Preview foto status pengerjaan</CardTitle>
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
                    placeholder="Masukan catatan"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2 mt-5">
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
