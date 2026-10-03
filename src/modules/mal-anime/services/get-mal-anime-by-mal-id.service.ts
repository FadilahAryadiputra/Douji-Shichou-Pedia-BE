import axios from "axios";
import { AppError } from "../../../utils/app.error.js";
import { MAL_BASE_URL, MAL_CLIENT_ID } from "../../../config/config.js";
import { MalAnime } from "../types/mal-anime.type.js";
import { prisma } from "../../../lib/prisma.js";

export class GetMalAnimesByMalIdService {

  getMalAnimeByMalId = async (malId: string) => {
    try {
      const response = await axios.get<MalAnime>(
        `${MAL_BASE_URL}/anime/${malId}`,
        {
          params: {
            fields: [
              "id",
              "title",
              "main_picture",
              "alternative_titles",
              "start_date",
              "end_date",
              "synopsis",
              "mean",
              // "rank",
              // "popularity",
              // "num_list_users",
              // "num_scoring_users",
              // "nsfw",
              "genres",
              // "created_at",
              // "updated_at",
              "media_type",
              "status",
              "num_episodes",
              "start_season",
              // "broadcast",
              // "source",
              // "average_episode_duration",
              // "rating",
              // "pictures",
              // "background",
              // "related_anime",
              // "related_manga",
              // "recommendations",
              "studios",
              // "statistics",
            ].join(","),
          },
          timeout: 30000,
          headers: {
            Accept: "application/json",
            "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
          },
        }
      );

      const anime = response.data;

      const existingAnime = await prisma.video.findUnique({
        where: {
          malId: anime.id,
        },
      });

      const { id, ...animeData } = anime;

      return {
        mal_id: id,
        ...animeData,
        is_imported: Boolean(existingAnime),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("========== MAL AXIOS ERROR ==========");
        console.error("code:", error.code);
        console.error("message:", error.message);
        console.error("url:", error.config?.url);
        console.error("status:", error.response?.status);
        console.error("response:", error.response?.data);
        console.error("=================================");

        throw new AppError(
          error.response?.data?.message ||
            "Failed to get anime by MAL Id",
          error.response?.status || 500
        );
      }

      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get anime by MAL Id", 500);
    }
  };
}
