import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing from your .env file!");
  console.error("Please add JWT_SECRET=your_secret_key to your .env file");
  throw new Error("JWT_SECRET is missing from your .env file!");
}
 
export interface JwtPayload {
  userId: string;
  email: string;
}

export const signJwt = (
  payload: JwtPayload,
  options?: SignOptions
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // Default to 1 day session
    ...options,
  });
};

export const verifyJwt = <T extends object = JwtPayload>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (error) {
    return null; // Token is expired or tampered with
  }
};