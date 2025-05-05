import bcrypt from "bcryptjs";
import { db } from "../db.config";
export const authenController = {
  register: async (body) => {
    try {
      const { email, password, fullName } = body;

      const exitedUser = await db.oneOrNone(
        "SELECT id FROM public.users WHERE email = $1",
        [email]
      );

      if (exitedUser) {
        throw new Error("มีผู้ใช้งานอยู่แล้ว");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const result = await db.one("INSERT INTO public.users (email, password_hash , full_name) VALUES ($1, $2, $3) RETURNING id", [email, bcrypt.hashSync(password, 10), fullName]);
      return result
    } catch (error) {
      return error.message;
    }
  },
};