import { z } from "zod";
import { PaginationQueryParamsSchema } from "../../pagination/schemas/pagination.schema.js";

export const getVideosSchema = PaginationQueryParamsSchema.extend({
  search: z.string().optional(),
  genre: z.string().optional(),

  sortBy: z.string().default("title"),
  sortOrder: z.string().default("asc"),
})

export type GetVideosSchema = z.infer<typeof getVideosSchema>;