import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";

export class UpdateVideoChannelsService {
  updateVideoChannels = async (
    videoSlug: string,
    channelIds: string[],
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const video = await tx.video.findUnique({
          where: {
            slug: videoSlug,
          },
          select: {
            id: true,
            slug: true,
          },
        });

        if (!video) {
          throw new AppError("Video not found", 404);
        }

        const uniqueChannelIds = [...new Set(channelIds)];

        const channels = await tx.channel.findMany({
          where: {
            id: {
              in: uniqueChannelIds,
            },
            deletedAt: null,
          },
          select: {
            id: true,
          },
        });

        const existingChannelIds = new Set(
          channels.map((channel) => channel.id),
        );

        const invalidChannelIds = uniqueChannelIds.filter(
          (channelId) => !existingChannelIds.has(channelId),
        );

        if (invalidChannelIds.length > 0) {
          throw new AppError(
            `Some channels do not exist: ${invalidChannelIds.join(", ")}`,
            400,
          );
        }

        for (const channelId of uniqueChannelIds) {
          await tx.videoChannel.upsert({
            where: {
              videoId_channelId: {
                videoId: video.id,
                channelId,
              },
            },
            create: {
              videoId: video.id,
              channelId,
            },
            update: {
              deletedAt: null,
            },
          });
        }

        await tx.videoChannel.updateMany({
          where: {
            videoId: video.id,
            channelId: {
              notIn: uniqueChannelIds,
            },
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        return await tx.videoChannel.findMany({
          where: {
            videoId: video.id,
            deletedAt: null,
          },
          include: {
            channel: {
              select: {
                id: true,
                slug: true,
                name: true,
              },
            }
          },
          orderBy: {
            createdAt: "asc",
          },
        });
      });
    } catch (error) {
      console.error("Error updating video channels:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "Failed to update video channels",
        500,
      );
    }
  };
}