import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      /** Set by `authMiddleware` when a valid Bearer token is present. */
      user?: {
        id: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export {};
