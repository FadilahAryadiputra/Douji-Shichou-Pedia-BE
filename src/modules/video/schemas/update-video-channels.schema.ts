import { z } from "zod";

export const updateVideoChannelsSchema = z.object({
  channelIds: z.array(z.string().uuid()),
});