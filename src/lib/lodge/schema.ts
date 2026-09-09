import { z } from "zod";

export const lodgeEditionRequestSchema = z.object({
  lodgeName: z.string().trim().min(2).max(120),
  lodgeNumber: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  region: z.string().trim().min(2).max(80),
  yearEstablished: z
    .string()
    .trim()
    .max(10)
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^(1[6-9]\d{2}|20\d{2})$/.test(v),
      "Enter a valid year (e.g. 1894)",
    ),
  lodgeColors: z.string().trim().max(120).optional().or(z.literal("")),
  productId: z.string().trim().min(1).max(80),
  productSlug: z.string().trim().min(1).max(120),
  style: z.enum(["classic", "architectural", "craftsman", "heritage"]),
  emblemIntent: z.enum(["none", "have", "help"]),
  quantityRange: z.enum([
    "1-5",
    "6-12",
    "13-24",
    "25-49",
    "50+",
    "unsure",
  ]),
  targetDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || !Number.isNaN(Date.parse(v)),
      "Enter a valid target date",
    ),
  contactEmail: z.string().trim().email().max(160),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  authorized: z.boolean().refine((v) => v === true, {
    message: "Authorization acknowledgment is required",
  }),
});

export type LodgeEditionRequestInput = z.infer<
  typeof lodgeEditionRequestSchema
>;
