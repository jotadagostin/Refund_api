import { Request, Response } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";

class UsersController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Nome obligatorio" }),
      email: z
        .string()
        .trim()
        .email({ message: "Email invalido" })
        .toLowerCase(),
      password: z
        .string()
        .min(6, { message: "A senha deve ter no minimo 6 caracteres" }),
      role: z
        .enum([UserRole.employee, UserRole.manager])
        .default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(req.body);

    res.json({ name, email, password, role });
  }
}

export { UsersController };
