import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";
import { GetVideosSchema } from "../schemas/get-videos.schema.js";

export class GetVideosService {
  getVideos = async (query: GetVideosSchema) => {
    try {
      const { take, page, sortBy, sortOrder, search, genre } = query;

      const whereClause: Prisma.VideoWhereInput = {};

      if (search) {
        whereClause.title = { contains: search, mode: "insensitive" };
      }
      if (genre) {
        whereClause.genres = {
          some: {
            genre: {
              name: {
                contains: genre,
                mode: "insensitive",
              },
            },
          },
        };
      }

      const videos = await prisma.video.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * take,
        take: take,
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
          channels: {
            where: {
              deletedAt: null,
            },
            include: {
              channel: {
                select: {
                  id: true,
                  slug: true,
                  name: true,
                  imageUrl: true,
                  largeImageUrl: true,
                },
              },
            },
          },
        },
      });

      const total = await prisma.video.count({
        where: whereClause,
      });

      return {
        message: "Get videos success!",
        data: videos,
        meta: { page, take, total },
      };
    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get videos", 500);
    }
  };
}
