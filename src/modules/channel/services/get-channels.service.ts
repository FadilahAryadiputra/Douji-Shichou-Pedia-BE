import { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../lib/prisma.js";
import { AppError } from "../../../utils/app.error.js";
import { GetChannelsSchema } from "../schemas/get-channels.schema.js";

export class GetChannelsService {

  getChannels = async (query: GetChannelsSchema) => {
    try {
      const { take, page, sortBy, sortOrder, search } = query;

      const whereClause: Prisma.ChannelWhereInput = {};

      if (search) {
        whereClause.name = { contains: search, mode: "insensitive" };
      }

      const channels = await prisma.channel.findMany({
        where: whereClause,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * take,
        take: take,
      });

      const total = await prisma.channel.count({
        where: whereClause,
      });

      return { data: channels, meta: { page, take, total } };

    } catch (error) {
      console.error("Error : ", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to get channels", 500);
    }
  };
}
