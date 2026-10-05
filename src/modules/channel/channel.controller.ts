import { Request, Response } from "express";
import { getChannelsSchema } from "./schemas/get-channels.schema.js";
import { GetChannelsService } from "./services/get-channels.service.js";
import { GetChannelBySlugService } from "./services/get-channel-by-slug.service.js";
import { UpdateChannelVideosService } from "./services/update-channel-videos.service.js";
import { updateChannelVideosSchema } from "./schemas/update-channel-videos.schema.js";
import { CreateChannelService } from "./services/create-channel.service.js";
import { UpdateChannelService } from "./services/update-channel.service.js";
import { updateChannelSchema } from "./schemas/update-channel.schema.js";
import { createChannelSchema } from "./schemas/create-channel.schema.js";

export class ChannelController {
  private getChannelsService: GetChannelsService;
  private getChannelBySlugService: GetChannelBySlugService;
  private updateChannelVideosService: UpdateChannelVideosService;
  private createChannelService: CreateChannelService;
  private updateChannelService: UpdateChannelService;

  constructor() {
    this.getChannelsService = new GetChannelsService();
    this.getChannelBySlugService = new GetChannelBySlugService();
    this.updateChannelVideosService = new UpdateChannelVideosService();
    this.createChannelService = new CreateChannelService();
    this.updateChannelService = new UpdateChannelService();
  }

  getChannels = async (req: Request, res: Response) => {
    const query = getChannelsSchema.parse(req.query);
    const result = await this.getChannelsService.getChannels(query);
    res.status(200).json(result);
  }

  getChannelBySlug = async (req: Request<{ slug: string }>, res: Response) => {
    const { slug: slug } = req.params;
    const result = await this.getChannelBySlugService.getChannelBySlug(slug);
    res.status(200).json(result);
  };

  updateChannelVideos = async (
    req: Request<{ slug: string }>,
    res: Response,
  ) => {
    const { slug } = req.params;
    const { videoIds } = updateChannelVideosSchema.parse(req.body);
    const result = await this.updateChannelVideosService.updateChannelVideos(
      slug,
      videoIds,
    );
    res.status(200).json(result);
  };

  createChannel = async (req: Request, res: Response) => {
    const body = createChannelSchema.parse(req.body);
    const result = await this.createChannelService.createChannel(body);
    res.status(200).json(result);
  };

  updateChannel = async (req: Request<{ slug: string }>, res: Response) => {
    const { slug: slug } = req.params;
    const body = updateChannelSchema.parse(req.body);
    const result = await this.updateChannelService.updateChannel(slug, body);
    res.status(200).json(result);
  };
}
