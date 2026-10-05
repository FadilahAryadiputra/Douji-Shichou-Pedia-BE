import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";

export class GetVideoBySlugService {
  getVideoBySlug = async (slug: string) => {
    try {
      const video = await prisma.video.findFirst({
        where: { slug },
        include: {
          genres: {
            select: {
              genre: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },

          channels: {
            where: {
              deletedAt: null,
            },
            select: {
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

          playlist: {
            select: {
              id: true,
              name: true,
              videos: {
                select: {
                  id: true,
                  slug: true,
                  title: true,
                  imageUrl: true,
                }
              }
            }
          },
          
          episodes: {
            select: {
              channelStreamEpisodes: {
                select: {
                  episode: {
                    select: {
                      id: true,
                      episodeNumber: true,
                      title: true,
                    }
                  },
                  stream: {
                    select: {
                      id: true,
                      link: true,
                      title: true,
                      channel: {
                        select: {
                          name: true,
                          imageUrl: true
                        }
                      }
                    }
                  },
                }
              }
            }
          }
        },
      });

      if (!video) {
        throw new AppError("Video not found", 404);
      }

      return {
        message: "Get video detail success!",
        data: video,
      };
    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get video by slug", 500);
    }
  };
}
