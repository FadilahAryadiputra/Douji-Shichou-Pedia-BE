import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";

export class GetChannelBySlugService {
  getChannelBySlug = async (slug: string) => {
    try {
      const channel = await prisma.channel.findFirst({
        where: { slug },
        include: {
          videos: {
            where: {
              deletedAt: null,
            },
            select: {
              video: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  imageUrl: true,
                  largeImageUrl: true,
                  score: true,
                  mediaType: true,
                  genres: {
                    select: {
                      genre: {
                        select: {
                          id: true,
                          name: true,
                        },
                      }
                    },
                  }
                },
              },
            },
          },
        },
      });

      if (!channel) {
        throw new AppError("Channel not found", 404);
      }

      return {
        message: "Get channel detail success!",
        data: channel,
      };
    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get channel by slug", 500);
    }
  };
}
