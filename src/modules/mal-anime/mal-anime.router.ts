import { Router } from "express";
import { MalAnimeController } from "./mal-anime.controller.js";


export class MalAnimeRouter {
  private router: Router;
  private malAnimeController: MalAnimeController;
  constructor() {
    this.router = Router();
    this.malAnimeController = new MalAnimeController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.get('/search', this.malAnimeController.getMalAnimes);

    this.router.get("/:malId", this.malAnimeController.getMalAnimeByMalId);

    this.router.post("/import/:malId", this.malAnimeController.importMalAnime);
  };

  getRouter = () => {
    return this.router;
  };
}
