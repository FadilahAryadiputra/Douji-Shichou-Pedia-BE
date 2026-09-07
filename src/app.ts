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

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private handleError(): void {
    /*
      📒 Docs:
      This is a not found error handler.
    */
    this.app.use(NotFoundMiddleware.handle());

    /*
        📒 Docs:
        This is a centralized error-handling middleware.
    */
    this.app.use(ErrorHandlerMiddleware.handle());
  }

  private routes(): void {;
    const authRouter = new AuthRouter();

    this.app.get("/api", (req: Request, res: Response) => {
      res.send(`Hello, Welcome to Douji Shichou Pedia API!`);
    });

    this.app.use("/api/auth", authRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`➜ [API] Local: http://localhost:${PORT}/`);
    });
  }
}
