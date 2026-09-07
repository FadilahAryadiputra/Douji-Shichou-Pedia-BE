import { NextFunction, Request, Response } from "express";
import { AuthRegisterService } from "./services/register.service.js";

export class AuthController {
  private authRegisterService: AuthRegisterService;

  constructor() {
    this.authRegisterService = new AuthRegisterService();
  }

  userRegister = async (req: Request, res: Response) => {
    const result = await this.authRegisterService.userRegister(req.body);
    res.status(200).json(result);
  };
}
