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
