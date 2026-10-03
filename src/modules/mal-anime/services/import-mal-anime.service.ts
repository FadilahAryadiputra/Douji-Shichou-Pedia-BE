import { AppError } from "../../../utils/app.error.js";
import { prisma } from "../../../lib/prisma.js";
import { GetMalAnimesByMalIdService } from "./get-mal-anime-by-mal-id.service.js";
import { generateUniqueVideoSlug } from "../../../utils/generate-unique-video-slug.js";

export class ImportAnimeService {
  private getMalAnimeByMalIdService: GetMalAnimesByMalIdService;

  constructor() {
    this.getMalAnimeByMalIdService = new GetMalAnimesByMalIdService();
  }

  importMalAnime = async (malId: string) => {
    try {
      const parsedMalId = Number(malId);

      if (!Number.isInteger(parsedMalId) || parsedMalId <= 0) {
        throw new AppError("Invalid MAL anime ID.", 400);
      }

      const existingVideo = await prisma.video.findUnique({
        where: {
          malId: parsedMalId,
        },
      });

      if (existingVideo) {
        throw new AppError(
          "This anime has already been imported.",
          409
        );
      }

      const anime =
        await this.getMalAnimeByMalIdService.getMalAnimeByMalId(
          String(parsedMalId)
        );

      const airedFrom = anime.start_date
        ? new Date(anime.start_date)
        : null;

      const airedTo = anime.end_date
        ? new Date(anime.end_date)
        : null;

      const videoSlug = await generateUniqueVideoSlug(anime.title);

      const video = await prisma.video.create({
        data: {
          slug: videoSlug,

          malId: anime.mal_id,

          title: anime.title,

          titleEnglish:
            anime.alternative_titles?.en ?? null,

          titleJapanese:
            anime.alternative_titles?.ja ?? null,

          synopsis:
            anime.synopsis ?? null,

          imageUrl:
            anime.main_picture?.medium ?? null,

          largeImageUrl:
            anime.main_picture?.large ?? null,

          airedFrom,
          airedTo,

          score:
            anime.mean ?? null,

          status:
            anime.status ?? null,

          totalEpisodes:
            anime.num_episodes ?? null,

          mediaType:
            anime.media_type ?? null,

          genres: {
            create:
              anime.genres?.map((animeGenre) => ({
                genre: {
                  connectOrCreate: {
                    where: {
                      name: animeGenre.name,
                    },
                    create: {
                      name: animeGenre.name,
                    },
                  },
                },
              })) ?? [],
          },
        },
      });

      return {
        message: "Anime imported successfully.",
        video,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Import MAL Anime Error:", error);

      throw new AppError(
        "Failed to import anime from MAL.",
        500
      );
    }
  };
}