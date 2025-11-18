import { OrderStatus, PaymentStatus, ProductionStatus } from "@prisma/client";
import * as z from "zod";

export const formCustomerSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib di isi." }),
  phone: z
    .string()
    .min(11, { message: "Nama wajib di isi dan minimal 11 karakter" })
    .max(12, { message: "No hp maksimal 12 karakter." }),
  email: z.email({ error: "Email tidak valid." }).min(1, "Email wajib di isi."),
  address: z.string().min(1, { message: "Alamat wajib di isi." }),
  notes: z.string().optional(),
});

export const formHargaJenisSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib di isi." }),
  description: z.string().min(1, { message: "Deskripsi wajib di isi." }),
  basePrice: z.union([
    z.string().min(1, { message: "Harga awal wajib di isi." }),
  ]),
  // pricePerArea: z.union([
  //   z.string().min(1, { message: "Harga per area wajib di isi." }),
  // ]),
  pricePerColor: z.union([
    z.string().min(1, { message: "Harga warna wajib di isi." }),
  ]),
  notes: z.string().optional(),
  isAtive: z.boolean().optional(),
});

export const formOrderSchema = z.object({
  // tb order /tb order item/ tb paryment
  orderNumber: z.string().min(1, "Order number wajib di isi."),
  customerId: z.string().min(1, "Customer  wajib di isi."), //tb design/tb order
  handleById: z.string().min(1, "Yang mengerjakan wajib di isi."),
  createdAt: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  product: z.string().min(1, "Produk/barang  wajib di isi."),
  color: z.string().min(1, "Warna wajib di isi."),
  unitPrice: z
    .string()
    .min(1, "Harga per unit wajib di isi.")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Harga per unit tidak boleh negatif.",
      }
    )
    .refine(
      (v) => {
        return Number(v) === 0 ? false : true;
      },
      {
        message: "Harga tidak boleh 0.",
      }
    ),
  quantity: z
    .string()
    .min(1, "Jumlah wajib di isi.")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Jumlah tidak boleh negatif.",
      }
    )
    .refine(
      (v) => {
        return Number(v) === 0 ? false : true;
      },
      {
        message: "Jumlah tidak boleh 0.",
      }
    ),
  totalAmount: z
    .string()
    .min(1, "Sub total wajib di isi.")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Sub total tidak boleh negatif.",
      }
    )
    .refine(
      (v) => {
        return Number(v) === 0 ? false : true;
      },
      {
        message: "Sub total tidak boleh 0.",
      }
    ),
  notes: z.string().optional(),
  status: z.string().min(1, "Status pemesanan wajib di isi."),
  size: z.string().min(1, "Ukuran wajib di isi."),
  // tb design
  filename: z.union([z.file(), z.string()]).optional(),
  previewUrl: z.string().optional(),
  productionDue: z.union([z.string(), z.date()]),
  //
  name: z.string().min(1, "Nama pemesan file wajib di isi."),
  phone: z.string().min(1, "Nomor hp pemesan file wajib di isi."),
  address: z.string().min(1, "Alamat pemesan wajib di isi."),
  email: z
    .email({ message: "Email pemesan tidak valid" })
    .min(1, "Email pemesan wajib di isi."),

  //
  sablonTypeId: z.string().min(1, "Type sablon wajib di isi."),
  colorCount: z.string().min(1, "Jumlah warna cetak wajib di isi."),
  printArea: z.string().min(1, "Area sablon wajib di isi."),
});

export const formPaymentSchema = z.object({
  orderId: z.string().min(1, "Pemesan dan produk pesanan wajib di isi."),
  amount: z
    .string()
    .min(1, "Sub total wajib di isi.")
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Sub total tidak boleh negatif.",
      }
    )
    .refine(
      (v) => {
        return Number(v) === 0 ? false : true;
      },
      {
        message: "Sub total tidak boleh 0.",
      }
    ),
  method: z.string().min(1, "Metode pembayaran wajib di isi."),
  status: z.string().min(1, "Status pembayaran wajib di isi."),
  type: z.string().min(1, "Type pembayaran wajib di isi."),
  reference: z.union([z.instanceof(File), z.string()]).refine(
    (val) => {
      if (val instanceof File) return val.size > 0;
      if (typeof val === "string") return val.trim().length > 0;
      return false;
    },
    {
      message: "Bukti pembayaran wajib diisi.",
    }
  ),
  paidAt: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  notes: z.string().optional(),
});

export const formProfileSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib di isi." }),
  phone: z
    .string()
    .min(11, { message: "Nomor hp wajib di isi dan minimal 11 karakter" })
    .max(12, { message: "Nomor hp maksimal 12 karakter." }),
  address: z.string().min(1, { message: "Alamat wajib di isi." }),
  image: z.union([z.file(), z.string()]).optional(),
  imageUrl: z.string().optional(),
});

export const formReportStatusOrderSchema = z
  .object({
    startDate: z.date({ message: "Tanggal mulai wajib diisi." }),
    endDate: z.date({ message: "Tanggal akhir wajib diisi." }),
    statusOrder: z.union([
      z.enum(Object.values(OrderStatus), {
        error: "Status pemesanan tidak valid.",
      }),
      z.string().min(1, "Status pemesanan wajib di isi."),
    ]),
  })

  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh sebelum tanggal mulai",
    path: ["endDate"],
  });

export const formReportStatusPaymentSchema = z
  .object({
    startDate: z.date({ message: "Tanggal mulai wajib diisi." }),
    endDate: z.date({ message: "Tanggal akhir wajib diisi." }),
    statusPayment: z.union([
      z.enum(Object.values(PaymentStatus), {
        error: "Status pembayaran tidak valid.",
      }),
      z.string().min(1, "Status pembayaran wajib di isi."),
    ]),
  })

  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh sebelum tanggal mulai",
    path: ["endDate"],
  });

export const formProductionSchema = z.object({
  orderItemId: z.string().min(1, "Order wajib di isi."),
  assignedToId: z.string().min(1, "Yang mengerjakan wajib di isi."),
  sablonTypeId: z.string().min(1, "Type sablon wajib di isi."),
  startDate: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  endDate: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  progress: z.string().min(1, "Progres pengerjaan"),

  status: z.union([
    z.enum(Object.values(ProductionStatus), {
      error: "Status produksi tidak valid.",
    }),
    z.string().min(1, "Status produksi wajib di isi."),
  ]),
  filename: z.union([z.file(), z.string()]).optional(),
  notes: z.string().optional(),
});


export const formSiteSchema = z.object({
  name: z.string().min(1, "Nama aplikasi wajib di isi.").max(20, "Nama aplikasi maksimal 20 karakter"),
  filename: z.union([z.file(), z.string()]).optional(),
})