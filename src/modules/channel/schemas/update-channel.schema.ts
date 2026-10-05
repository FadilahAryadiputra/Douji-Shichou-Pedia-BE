import { z } from "zod";

export const updateChannelSchema = z.object({
  slug: z
    .string({ error: "Slug is required!" })
    .min(1, { error: "Slug cannot be empty!" })
    .regex(
      /^[a-z0-9]+(?:_[a-z0-9]+)*$/,
      "Invalid slug format. Use lowercase letters, numbers, and underscores only.",
    ),

  name: z
    .string({ error: "Name is required" })
    .min(1, { error: "Name cannot be empty!" }),

  nameJapanese: z.string().optional(),

  description: z.string().optional(),

  youtubeUrl: z.string().optional(),

  imageUrl: z.string().optional(),

  largeImageUrl: z.string().optional(),
});

export type UpdateChannelInput = z.infer<typeof updateChannelSchema>;
