import { Router } from "express";
import { ChannelController } from "./channel.controller.js";


export class ChannelRouter {
  private router: Router;
  private channelController: ChannelController;
  constructor() {
    this.router = Router();
    this.channelController = new ChannelController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get('/', this.channelController.getChannels);

    this.router.get("/:slug", this.channelController.getChannelBySlug);

    this.router.put("/:slug/update-channel-videos", this.channelController.updateChannelVideos);

    this.router.post("/create-channel", this.channelController.createChannel);

    this.router.put("/:slug/update-channel", this.channelController.updateChannel);
  };

  getRouter = () => {
    return this.router;
  };
}
