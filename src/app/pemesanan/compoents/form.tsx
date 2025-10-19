"use client";
import React, {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { SaveAllIcon, Target, Trash2Icon, X } from "lucide-react";
import { formOrderSchema } from "@/types/zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addOrder, updateOrder } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { TypeOf } from "zod/v3";
import { Customer, OrderStatus, SablonType, User } from "@prisma/client";
import { IconInvoice, IconUserCircle } from "@tabler/icons-react";
import { useSheet } from "@/components/providers/Sheet-provider";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFile } from "@/lib/formatFile";
import { createOrderNumber } from "@/lib/createOrderNumber";
import DateInput from "@/components/DateInput";

interface FormOrderProps {
  customer: Customer[];
 handle: User[];
  sablon: SablonType[]; 
  id?: string | null;
}

const statusOrder: string[] = Object.values(OrderStatus);
const FormPage = ({
  id,
  orderNumber,
  customerId,
  phone,
  email,
  address,
  createdAt,
  productionDue,
  product,
  color,
  unitPrice,
  quantity,
  totalAmount,
  notes,
  status,
  filename,
  customer,
  previewUrl,
  size,
  name,
  handleById,
  sablonTypeId,
  handle,
  sablon,
  colorCount,
  printArea,
}: Partial<z.infer<typeof formOrderSchema>> & FormOrderProps) => {
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);
  const [orderNumberValue, setOrderNumberValue] = useState<string | null>(
    orderNumber ?? ""
  );
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();

  useEffect(() => {
    if (!id) {
      getOrderNumber();
    }
  }, []);

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 15);

  const form = useForm<z.infer<typeof formOrderSchema>>({
    resolver: zodResolver(formOrderSchema),
    defaultValues: {
      customerId: customerId ?? "",
      handleById: handleById ?? "",
      sablonTypeId: sablonTypeId ?? "",
      name: name ?? "",
      size: size ?? "",
      address: address ?? "",
      phone: phone ?? "",
      email: email ?? "",
      product: product ?? "",
      color: color ?? "",
      filename: "",
      status: status ?? "PENDING",
      notes: notes ?? "",
      createdAt: createdAt ? new Date(createdAt) : new Date().toISOString(),
      unitPrice: unitPrice ?? "",
      quantity: quantity ?? "",
      totalAmount: totalAmount ?? "",
      orderNumber: orderNumber ? orderNumber : orderNumberValue ?? "",
      productionDue: productionDue
        ? new Date(productionDue)
        : currentDate.toISOString(),
      colorCount: colorCount ?? "",
      printArea: printArea ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formOrderSchema>) => {
    const formData = new FormData();

    formData.append("notes", values.notes ?? "");
    formData.append("customerId", values.customerId);
    formData.append("product", values.product);
    formData.append("color", values.color);
    formData.append("filename", values.filename ?? "");
    formData.append("status", values.status);
    formData.append(
      "createdAt",
      new Date(values.createdAt ?? "").toISOString()
    );
    formData.append("size", values.size);
    formData.append("unitPrice", values.unitPrice);
    formData.append("quanatity", values.quantity);
    formData.append("totalAmount", values.totalAmount);
    formData.append("orderNumber", values.orderNumber);
    formData.append("phone", values.phone ?? "");
    formData.append("email", values.email ?? "");
    formData.append("address", values.address ?? "");
    formData.append("name", values.name ?? "");
    formData.append(
      "productionDue",
      new Date(values.productionDue ?? "").toISOString()
    );
    formData.append("handleById", values.handleById);
    formData.append("sablonTypeId", values.sablonTypeId);
    formData.append("colorCount", values.colorCount);
    formData.append("printArea", values.printArea);
    try {
      setLoading(true);
      const { success, message, error } = id
        ? await updateOrder(id, formData)
        : await addOrder(formData);
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

  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  const getOrderNumber = async () => {
    const res = await createOrderNumber();
    setOrderNumberValue(res);
    form.setValue("orderNumber", res);
  };

  const findCustomer = (id: string) =>
    customer.find((e) => String(e.id) === id);
  // Hitung otomatis unitPrice & totalAmount
  useEffect(() => {
    const sablonId = form.getValues("sablonTypeId");
    const sablonItem = sablon.find((e) => String(e.id) === sablonId);

    const colorCount = Number(form.watch("colorCount") || 0);
    const printArea = Number(form.watch("printArea") || 0);
    const quantity = Number(form.watch("quantity") || 0);

    if (sablonItem && colorCount > 0 && printArea > 0) {
      const basePrice = Number(sablonItem.basePrice);
      const pricePerColor = Number(sablonItem.pricePerColor);

      const unitPrice = basePrice + pricePerColor * colorCount * printArea;
      form.setValue("unitPrice", String(unitPrice));

      if (quantity > 0) {
        const totalAmount = unitPrice * quantity;
        form.setValue("totalAmount", String(totalAmount));
      }
    }
  }, [
    form.watch("colorCount"),
    form.watch("printArea"),
    form.watch("quantity"),
    form.watch("sablonTypeId"),
  ]);

  return (
    <div className="w-full mb-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errr) => {
            console.log({ errr });
          })}
          className="space-y-4"
        >
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <Card className=" w-full rounded-sm bg-slate-100">
              <CardContent className="flex items-center justify-between gap-1">
                <span className="flex items-center gap-1 text-muted-foreground font-medium">
                  <IconInvoice className="h-4 w-4" />
                  Nomor order :
                </span>
                <span className="font-medium text-primary">
                  {orderNumberValue ?? "-"}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* customer form */}
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <IconUserCircle className="h-4 w-4" />
            Form data pelanggan
          </span>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Pemesan/pelanggan</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      const customerValue = findCustomer(
                        form.getValues("customerId")
                      );
                      if (customerValue) {
                        form.setValue("phone", String(customerValue?.phone));
                        form.setValue("email", String(customerValue?.email));
                        form.setValue(
                          "address",
                          String(customerValue?.address)
                        );
                        form.setValue("name", customerValue.name);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih pemesan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customer.map((e) => (
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
              name="phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nomor hp</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      readOnly
                      placeholder="Nomor hp"
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
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="w-full "
                      readOnly
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
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
                      className="w-full "
                      readOnly
                      placeholder="Alamat"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* end customer form */}
          {/* product form */}
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <IconUserCircle className="h-4 w-4" />
            Form data produk/barang
          </span>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Produk/barang</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full "
                      placeholder="Produk/barang"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Warna</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Masukan warna"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* handle */}
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
            <div className="flex flex-col gap-1 w-full">
              <FormField
                control={form.control}
                name="colorCount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Jumlah warna cetak</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full "
                        placeholder="jumlah warna cetak"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="printArea"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Area sablon</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="w-full "
                        placeholder="jumlah area sablon"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                    <FormDescription className="text-sm text-muted-foreground">
                      Area sablon (misal Data depan & belakang - 2 sisi)
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Ukuran</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full"
                      placeholder="Masukan ukuran"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full "
                      placeholder="Jumlah"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        const getUnitPrice = form.getValues("unitPrice");
                        if (getUnitPrice) {
                          const totalAmountValue =
                            Number(e.target.value) * Number(getUnitPrice);
                          form.setValue(
                            "totalAmount",
                            String(totalAmountValue)
                          );
                        }
                      }}
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
              name="unitPrice"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Harga satuan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="w-full"
                      placeholder="Harga satuan"
                      {...field}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sub total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      readOnly
                      className="w-full "
                      placeholder="Sub total"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" text-xs text-destructive min-h-[20px]" />
                </FormItem>
              )}
            />
          </div>
          {/* end product form */}
          {/* design form */}
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Desain file</FormLabel>
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
                <CardTitle>Preview desain file</CardTitle>
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
          {/* end design form */}
          {/*  */}
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
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
                      {statusOrder.map((e) => (
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
            <FormField
              control={form.control}
              name="handleById"
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
          </div>
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
                    <FormLabel>Tanggal pemesanan</FormLabel>
                    <DateInput field={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="productionDue"
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
          {/*  */}
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
