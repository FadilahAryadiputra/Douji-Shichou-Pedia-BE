import { z } from "zod";

export const createChannelSchema = z.object({
  slug: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        /^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(value),
      {
        message:
          "Invalid slug format. Use lowercase letters, numbers, and underscores only.",
      },
    ),

  name: z
    .string({ error: "Name is required!" })
    .min(1, { error: "Name cannot be empty!" }),

  nameJapanese: z.string().optional(),

  description: z.string().optional(),

  youtubeUrl: z.string().optional(),

  imageUrl: z.string().optional(),

  largeImageUrl: z.string().optional(),
});

export type CreateChannelInput = z.infer<typeof createChannelSchema>;
