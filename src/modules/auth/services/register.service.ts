import { AppError } from "../../../utils/app.error.js";
import { PasswordService } from "../../password/password.service.js";
import { prisma } from "../../../lib/prisma.js";
import { RegisterInput } from "../schemas/register.schema.js";

export class AuthRegisterService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  userRegister = async (body: RegisterInput) => {
    try {
      const normalizedEmail = body.email.trim().toLowerCase();
      if (!normalizedEmail) throw new AppError("Email is required!", 400);

      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser){
        throw new AppError("Email already used!", 400)
      }

      const hashedPassword = await this.passwordService.hashPassword(
        body.password
      );

      if (existingUser) {
        throw new AppError('Email already exists', 400);
      } else {
        await prisma.user.create({
          data: {
            email: normalizedEmail,
            username: body.username,
            role: "USER",
            password: hashedPassword,
          },
          select: { id: true, email: true },
        });
      }

      return {
        message:
          "Account created successfully.",
      };
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Failed to create account.", 500);
    }
  };
}
