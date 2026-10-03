import { Request, Response } from "express";
import { getMalAnimesSchema } from "./schemas/get-mal-animes.schema.js";
import { GetAnimesService } from "./services/get-mal-animes.service.js";
import { GetMalAnimesByMalIdService } from "./services/get-mal-anime-by-mal-id.service.js";
import { ImportAnimeService } from "./services/import-mal-anime.service.js";

export class MalAnimeController {
  private getAnimesService: GetAnimesService;
  private getMalAnimeByMalIdService: GetMalAnimesByMalIdService;
  private importAnimeService: ImportAnimeService;

  constructor() {
    this.getAnimesService = new GetAnimesService();
    this.getMalAnimeByMalIdService = new GetMalAnimesByMalIdService();
    this.importAnimeService = new ImportAnimeService();
  }

  getMalAnimes = async (req: Request, res: Response) => {
    const query = getMalAnimesSchema.parse(req.query);
    const result = await this.getAnimesService.getMalAnimes(query);
    res.status(200).json(result);
  };

  getMalAnimeByMalId = async (req: Request<{ malId: string }>, res: Response) => {
    const { malId: malId } = req.params;
    const result = await this.getMalAnimeByMalIdService.getMalAnimeByMalId(malId);
    res.status(200).json(result);
  };

  importMalAnime = async (req: Request<{ malId: string }>, res: Response) => {
    const { malId } = req.params;
    const result = await this.importAnimeService.importMalAnime(malId);
    res.status(201).json(result);
  };
}
