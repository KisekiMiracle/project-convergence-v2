import { app, SECRET_KEY } from "~/index";
import { db } from "~/utils/db"; // db is the Drizzle instance
import { users, profiles } from "~/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireAuth } from "./require";

export function AuthRoutes() {
  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    try {
      // Drizzle Transactions handle BEGIN/COMMIT/ROLLBACK automatically
      await db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({
            name,
            email,
            password: hashedPassword,
          })
          .returning({ id: users.id });

        await tx.insert(profiles).values({
          userId: newUser!.id,
          displayName: name,
        });
      });

      return res.status(201).send({
        success: true,
        message: "Account created successfully.",
      });
    } catch (error: any) {
      // Postgres Unique Violation error code
      if (error.code === "23505") {
        return res.status(409).send({
          success: false,
          message: "An account registered with that email already exists.",
        });
      }

      return res.status(500).send({
        success: false,
        message: "We had problems creating that user. Please, try again.",
      });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    const { email, password } = req.body;

    // Use .findFirst for clean single-record retrieval
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Incorrect Credentials.",
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return res.status(400).send({
        success: false,
        message: "Incorrect Credentials.",
      });
    }

    const access_token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "15m",
    });
    const refresh_token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "1w",
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("accessToken", access_token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refresh_token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).send({
      success: true,
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    return res.status(200).send({
      success: true,
      user: req.user,
    });
  });

  app.get("/api/auth/signout", async (_req, res) => {
    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).send({
      success: true,
      message: "Signed out successfully.",
    });
  });
}
