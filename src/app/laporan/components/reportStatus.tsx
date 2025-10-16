"use client";
import { OrderStatus, PaymentStatus } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarArrowUp, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formReportDateSchema } from "@/types/zod";

const statusOrders: string[] = Object.values(OrderStatus);
const statusPayments: string[] = Object.values(PaymentStatus);

interface ResportStatuProps {
  setStartDate: Dispatch<SetStateAction<Date>>;
  setEndDate: Dispatch<SetStateAction<Date>>;
  startDate: Date;
  endDate: Date;
}

const ResportStatu = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: ResportStatuProps) => {
  const form = useForm<z.infer<typeof formReportDateSchema>>({
    resolver: zodResolver(formReportDateSchema),
    defaultValues: {
      startDate,
      endDate,
    },
  });

  function onSubmit(data: z.infer<typeof formReportDateSchema>) {
    setStartDate(data.startDate);
    setEndDate(data.endDate);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-end gap-2 w-full max-w-md">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="relative flex flex-col flex-1">
                <FormLabel>Tanggal mulai</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="absolute -bottom-5 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="relative flex flex-col flex-1">
                <FormLabel>Tanggal akhir</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="absolute -bottom-5 text-xs text-destructive" />
              </FormItem>
            )}
          />
          <Button type="submit">
            <CalendarArrowUp /> Cari
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ResportStatu;
