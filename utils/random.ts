import { createHash } from "crypto";

export const hashify = (input: string): string => {
  return createHash("sha256").update(input).digest("hex");
};
