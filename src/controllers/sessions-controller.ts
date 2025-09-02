import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";

class SessionsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: "Email invalido!" }),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(req.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new AppError("Email ou senha incorretos!", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Email ou senha incorretos!", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
