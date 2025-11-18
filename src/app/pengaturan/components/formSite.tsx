"use client";

import { useSheet } from "@/components/providers/Sheet-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { formSiteSchema } from "@/types/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, z } from "zod";
import { storeSite } from "../actions";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaveAllIcon, Trash2Icon, X } from "lucide-react";
import Image from "next/image";
import previewImg from "@/public/preview.jpg";
import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";

interface FormSiteProps {
  name?: string;
  filename?: string;
  fileUrl?: string;
}
const FormSite: React.FC<FormSiteProps> = ({ name, filename, fileUrl }) => {
  const { update, data: session } = useSession();
  const [preview, setPreview] = useState<string | null>(
    session?.user.siteFileProofUrl ?? null
  );
  const [loading, setLoading] = useState(false);
  const { setOpen } = useSheet();
  const form = useForm<z.infer<typeof formSiteSchema>>({
    resolver: zodResolver(formSiteSchema),
    defaultValues: {
      name: session?.user.siteName ?? "",
      filename: session?.user.siteFileName ?? "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSiteSchema>) => {
    const formData = new FormData();
    Object.entries(values).forEach(([e, val]) => formData.append(e, val));
    try {
      setLoading(true);
      const { success, message, error, data } = await storeSite(formData);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (data)
        await update({
          user: {
            ...session?.user,
            siteName: data.name,
            siteFileName: data.filename,
            siteFileProofUrl: data.fileProofUrl,
          },
        });
      if (error) toast.error("Ops...");
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };
  const deleteFileImagePreview = () => {
    setPreview(process.env.NEXT_PUBLIC_PREVIEW ?? null);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            disabled={loading}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nama App</FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    placeholder="Masukan aplikasi"
                    {...field}
                  />
                </FormControl>
                <FormMessage className=" text-xs text-destructive" />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:justify-between md:flex-row items-start gap-1">
            <FormField
              control={form.control}
              name="filename"
              disabled={loading}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Logo</FormLabel>
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
                <CardTitle>Preview Logo</CardTitle>
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
          <div className="flex justify-end gap-2 mt-5">
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

export default FormSite;
