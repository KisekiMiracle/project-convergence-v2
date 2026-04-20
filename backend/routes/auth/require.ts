import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "~/index";
import { db } from "~/utils/db"; // Using the Drizzle instance now
import { profiles } from "~/db/schema";
import { eq } from "drizzle-orm";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { accessToken, refreshToken } = req.cookies;

  // 1. No Access Token - Check Refresh Token
  if (!accessToken) {
    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: "Not authenticated.",
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, SECRET_KEY) as { id: string };

      // Generate new Access Token
      const access_token = jwt.sign({ id: decoded.id }, SECRET_KEY, {
        expiresIn: "15m",
      });

      res.cookie("accessToken", access_token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 15,
      });

      // Drizzle query instead of raw pg
      const userProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, decoded.id),
      });

      if (!userProfile) {
        return res.status(401).send({
          success: false,
          message: "User no longer exists.",
        });
      }

      req.user = userProfile;
      return next();
    } catch {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }
  }

  // 2. Validate existing Access Token
  try {
    const decoded = jwt.verify(accessToken, SECRET_KEY) as { id: string };

    const userProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, decoded.id),
    });

    if (!userProfile) {
      return res.status(401).send({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = userProfile;
    next();
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}
