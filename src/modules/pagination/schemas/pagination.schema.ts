import { z } from "zod";

export const PaginationQueryParamsSchema = z.object({
  take: z.coerce.number().default(10),
  
  page: z.coerce.number().default(1),
  
  sortBy: z.string().default("createdAt"),
  
  sortOrder: z.string().default("desc"),
});

export type PaginationQueryParams = z.infer<typeof PaginationQueryParamsSchema>;
