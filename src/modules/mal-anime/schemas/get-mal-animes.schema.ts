import { z } from "zod";
import { PaginationQueryParamsSchema } from "../../pagination/schemas/pagination.schema.js";

export const getMalAnimesSchema = PaginationQueryParamsSchema.extend({
  q: z.string().min(1),
  page: z.coerce.number().int().positive().default(1),
  take: z.coerce.number().int().positive().max(20).default(5),
});

export type GetMalAnimesSchema = z.infer<typeof getMalAnimesSchema>;