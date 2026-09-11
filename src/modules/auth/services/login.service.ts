import { AppError } from "../../../utils/app.error.js";
import { PasswordService } from "../../password/password.service.js";
import { prisma } from "../../../lib/prisma.js";
import { LoginInput } from "../schemas/login.schema.js";
import { createToken } from "../../../lib/jwt.js";

export class AuthLoginService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  userLogin = async (body: LoginInput) => {
    const normalizedEmail = body.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new AppError("Account has not been registered", 401);
    }

    if (!user.password) {
      throw new AppError("Invalid credentials", 401);
    }

    const comparedPassword = await this.passwordService.comparePassword(
      body.password,
      user.password,
    );

    if (!comparedPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
    };

    const token = createToken({
      payload,
      secretKey: process.env.JWT_SECRET_KEY!,
      options: { expiresIn: "3h" },
    });

    return {
      token,
      payload,
    };
  };
}