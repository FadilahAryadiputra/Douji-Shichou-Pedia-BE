import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { AuthController } from "./auth.controller.js";
import { registerSchema } from "./schemas/register.schema.js";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;
  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/register",
      validateBody(registerSchema),
      this.authController.userRegister
    );
  };

  getRouter = () => {
    return this.router;
  };
}
