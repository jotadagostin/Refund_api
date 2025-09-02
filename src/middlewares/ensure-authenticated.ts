import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT Token missing", 401);
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: userId } = verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload;

    request.user = { id: userId, role };

    return next();
  } catch (error) {
    throw new AppError("Invalid JWT Token", 401);
  }
}

export { ensureAuthenticated };
