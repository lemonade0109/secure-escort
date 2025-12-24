import { compareSync, hashSync } from "bcrypt-ts-edge";

export const hashPassword = async (password: string) => {
  return hashSync(password, 10);
};

export const verifyPassword = async (password: string, hashed: string) => {
  return compareSync(password, hashed);
};
