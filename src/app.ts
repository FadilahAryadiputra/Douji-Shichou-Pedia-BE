import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import cors from "cors";
import { PORT } from "./config/config.js";
import { AppError } from "./utils/app.error.js";
import { NotFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { ErrorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { AuthRouter } from "./modules/auth/auth.router.js";
import { MalAnimeRouter } from "./modules/mal-anime/mal-anime.router.js";
import { VideoRouter } from "./modules/video/video.router.js";
import { ChannelRouter } from "./modules/channel/channel.router.js";

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors({ origin: [/\.vercel\.app$/, "http://localhost:3000"], credentials: true }));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    this.app.use(NotFoundMiddleware.handle());
    this.app.use(ErrorHandlerMiddleware.handle());
  }

  private routes(): void {;
    const authRouter = new AuthRouter();
    const malAnimeRouter = new MalAnimeRouter();
    const videoRouter = new VideoRouter();
    const channelRouter = new ChannelRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Hello, Welcome to Douji Shichou Pedia API!`);
    });

    this.app.use("/api/auth", authRouter.getRouter());
    this.app.use("/api/mal-anime", malAnimeRouter.getRouter());
    this.app.use("/api/video", videoRouter.getRouter());
    this.app.use("/api/channel", channelRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`➜ [API] Local: http://localhost:${PORT}/`);
    });
  }
}
