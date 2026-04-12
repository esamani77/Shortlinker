import { createHmac, randomBytes } from "crypto";

export function createHash(
  password: string,
  salt: string | undefined = undefined,
) {
  const saltToUse = salt || randomBytes(16).toString("hex");
  const hashed = createHmac("sha256", saltToUse).update(password).digest("hex");

  return {
    salt: saltToUse,
    hash: hashed,
  };
}
