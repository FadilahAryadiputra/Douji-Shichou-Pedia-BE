import { z } from "zod";
import { PaginationQueryParamsSchema } from "../../pagination/schemas/pagination.schema.js";

export const getChannelsSchema = PaginationQueryParamsSchema.extend({
  search: z.string().optional(),

  sortBy: z.string().default("name"),
  sortOrder: z.string().default("asc"),
})

export type GetChannelsSchema = z.infer<typeof getChannelsSchema>;