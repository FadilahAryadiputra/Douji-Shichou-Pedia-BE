import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";
import { generateUniqueChannelSlug } from "../../../utils/generate-unique-channel-slug.js";
import { CreateChannelInput } from "../schemas/create-channel.schema.js";

export class CreateChannelService {
  createChannel = async (body: CreateChannelInput) => {
    try {
      const slug = body.slug
        ? body.slug
        : await generateUniqueChannelSlug(body.name);

      const validateSlug = await prisma.channel.findUnique({
        where: {
          slug,
        },
      });

      if (validateSlug) {
        throw new AppError("Slug already exists", 400);
      }

      const channel = await prisma.channel.create({
        data: {
          slug,
          name: body.name,
          nameJapanese: body.nameJapanese?.trim() || null,
          description: body.description?.trim() || null,
          youtubeUrl: body.youtubeUrl?.trim() || null,
          imageUrl: body.imageUrl?.trim() || null,
          largeImageUrl: body.largeImageUrl?.trim() || null,
        },
      });

      return {
        message: "Channel created successfully!",
        data: channel,
      };
    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to create channel", 500);
    }
  };
}
