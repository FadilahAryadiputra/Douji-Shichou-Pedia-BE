import { Request, Response } from "express";
import { getVideosSchema } from "./schemas/get-videos.schema.js";
import { GetVideosService } from "./services/get-videos.service.js";
import { GetVideoBySlugService } from "./services/get-video-by-slug.service.js";
import { UpdateVideoChannelsService } from "./services/update-video-channels.service.js";
import { updateVideoChannelsSchema } from "./schemas/update-video-channels.schema.js";

export class VideoController {
  private getVideosService: GetVideosService;
  private getVideoBySlugService: GetVideoBySlugService;
  private updateVideoChannelsService: UpdateVideoChannelsService;

  constructor() {
    this.getVideosService = new GetVideosService();
    this.getVideoBySlugService = new GetVideoBySlugService();
    this.updateVideoChannelsService = new UpdateVideoChannelsService();
  }

  getVideos = async (req: Request, res: Response) => {
    const query = getVideosSchema.parse(req.query);
    const result = await this.getVideosService.getVideos(query);
    res.status(200).json(result);
  };

  getVideoBySlug = async (req: Request<{ slug: string }>, res: Response) => {
    const { slug: slug } = req.params;
    const result = await this.getVideoBySlugService.getVideoBySlug(slug);
    res.status(200).json(result);
  };

  updateVideoChannels = async (
    req: Request<{ slug: string }, {}, { channelIds: string[] }>,
    res: Response,
  ) => {
    const { slug } = req.params;
    const { channelIds } = updateVideoChannelsSchema.parse(req.body);
    const result = await this.updateVideoChannelsService.updateVideoChannels(
      slug,
      channelIds,
    );

    res.status(200).json({
      message: "Video channels updated successfully",
      data: result,
    });
  };
}
