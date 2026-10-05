import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";
import { UpdateChannelInput } from "../schemas/update-channel.schema.js";

export class UpdateChannelService {
  updateChannel = async (channelSlug: string, body: UpdateChannelInput) => {
    try {
      const validateSlug = await prisma.channel.findUnique({
        where: {
          slug: body.slug,
        },
      });

      if (validateSlug && validateSlug.slug !== channelSlug) {
        throw new AppError("Slug already exists", 400);
      }

      const channel = await prisma.channel.update({
        where: {
          slug: channelSlug,
        },
        data: {
          slug: body.slug,
          name: body.name,
          nameJapanese: body.nameJapanese?.trim() || null,
          description: body.description?.trim() || null,
          youtubeUrl: body.youtubeUrl?.trim() || null,
          imageUrl: body.imageUrl?.trim() || null,
          largeImageUrl: body.largeImageUrl?.trim() || null,
        },
      });

      return {
        message: "Channel updated successfully!",
        data: channel,
      };
    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update channel", 500);
    }
  };
}
