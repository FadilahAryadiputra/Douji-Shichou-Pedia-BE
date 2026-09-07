import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

interface CreateTokenProps {
  payload: Record<string, unknown>;
  secretKey: string;
  options?: SignOptions;
}

export const createToken = ({
  payload,
  secretKey,
  options,
}: CreateTokenProps) => {
  return jwt.sign(payload, secretKey, options);
};