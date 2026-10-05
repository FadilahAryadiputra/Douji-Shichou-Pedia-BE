import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";

export class UpdateChannelVideosService {
  updateChannelVideos = async (channelSlug: string, videoIds: string[]) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const channel = await tx.channel.findUnique({
          where: {
            slug: channelSlug,
          },
          select: {
            id: true,
          },
        });

        if (!channel) {
          throw new AppError("Channel not found", 404);
        }

        const uniqueVideoIds = [...new Set(videoIds)];

        const videos = await tx.video.findMany({
          where: {
            id: {
              in: uniqueVideoIds,
            },
            deletedAt: null,
          },
          select: {
            id: true,
          },
        });

        const existingVideoIds = new Set(videos.map((video) => video.id));

        const invalidVideoIds = uniqueVideoIds.filter(
          (videoId) => !existingVideoIds.has(videoId),
        );

        if (invalidVideoIds.length > 0) {
          throw new AppError(
            `Some videos do not exist: ${invalidVideoIds.join(", ")}`,
            400,
          );
        }

        for (const videoId of uniqueVideoIds) {
          await tx.videoChannel.upsert({
            where: {
              videoId_channelId: {
                channelId: channel.id,
                videoId,
              },
            },
            create: {
              channelId: channel.id,
              videoId,
            },
            update: {
              deletedAt: null,
            },
          });
        }

        await tx.videoChannel.updateMany({
          where: {
            channelId: channel.id,
            videoId: {
              notIn: uniqueVideoIds,
            },
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        const channelVideos = await tx.videoChannel.findMany({
          where: {
            channelId: channel.id,
            deletedAt: null,
          },
          include: {
            video: {
              select: {
                id: true,
                slug: true,
                malId: true,
                title: true,
                titleEnglish: true,
                titleJapanese: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        return {
          message: "Channel videos updated successfully",
          data: channelVideos,
        };
      });
    } catch (error) {
      console.error("Error updating channel videos:", error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("Failed to update channel videos", 500);
    }
  };
}
