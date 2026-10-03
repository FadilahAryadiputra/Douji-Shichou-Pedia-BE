import axios from "axios";
import { MAL_BASE_URL, MAL_CLIENT_ID } from "../../../config/config.js";
import { AppError } from "../../../utils/app.error.js";
import { GetMalAnimesSchema } from "../schemas/get-mal-animes.schema.js";
import { MalAnimeSearchResponse } from "../types/mal-anime.type.js";

export class GetAnimesService {
  getMalAnimes = async (query: GetMalAnimesSchema) => {
    try {
      const offset = (query.page - 1) * query.take;

      const response = await axios.get<MalAnimeSearchResponse>(
        `${MAL_BASE_URL}/anime`,
        {
          params: {
            q: query.q,
            limit: query.take,
            offset,
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
          headers: {
            "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
          },
          timeout: 60000,
        },
      );

      const data = response.data.data.map((item) => {
        const { id, ...anime } = item.node;

        return {
          mal_id: id,
          ...anime,
        };
      });

      return {
        data,
        pagination: {
          page: query.page,
          take: query.take,
          hasNextPage: Boolean(response.data.paging?.next),
          hasPreviousPage: Boolean(response.data.paging?.previous),
        },
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
          error.response?.data?.message || "Failed to get animes from MAL",
          error.response?.status || 500,
        );
      }

      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get animes from MAL", 500);
    }
  };
}
