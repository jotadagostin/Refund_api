import { json, Request, response, Response } from "express";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { prisma } from "@/database/prisma";

const CategoriesEnum = z.enum(["food", "others", "services", "transport"]);

class RefundsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1, { message: "Name is required" }),
      category: CategoriesEnum,
      amount: z.number().positive({ message: "Amount must be positive" }),
      filename: z.string().min(10),
    });

    const { name, category, amount, filename } = bodySchema.parse(req.body);

    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: req.user.id,
      },
    });

    res.status(201).json(refund);
  }

  async index(req: Request, res: Response) {
    response.json({ message: "Hello World" });
  }
}

export { RefundsController };
