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
  basePrice: z.union([z.string().min(1, { message: "Harga awal wajib di isi." })]),
  pricePerArea: z.union([z.string().min(1, { message: "Harga per area wajib di isi." })]),
  pricePerColor: z.union([z.string().min(1, { message: "Harga warna wajib di isi." })]),
  notes: z.string().optional(),
  isAtive: z.boolean().optional()
});
