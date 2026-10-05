import { Router } from "express";
import { VideoController } from "./video.controller.js";


export class VideoRouter {
  private router: Router;
  private videoController: VideoController;
  constructor() {
    this.router = Router();
    this.videoController = new VideoController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get('/', this.videoController.getVideos);
    
    this.router.get("/:slug", this.videoController.getVideoBySlug);
    
    this.router.put("/:slug/update-video-channels", this.videoController.updateVideoChannels);
  };

  getRouter = () => {
    return this.router;
  };
}
