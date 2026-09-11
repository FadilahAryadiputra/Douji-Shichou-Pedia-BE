import { Router } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { AuthController } from "./auth.controller.js";
import { registerSchema } from "./schemas/register.schema.js";
import { loginSchema } from "./schemas/login.schema.js";

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

    this.router.post(
      "/login",
      validateBody(loginSchema),
      this.authController.userLogin
    );
  };

  getRouter = () => {
    return this.router;
  };
}
