// src/types/index.d.ts (or wherever you define global Express types)
import { Profile } from "../db/schema";

declare global {
  namespace Express {
    interface Request {
      user?: Profile; // Now it matches exactly what db.query returns!
    }
  }
}
