import { z } from "zod";

export const updateChannelVideosSchema = z.object({
  videoIds: z.array(z.string().uuid()),
});