import { error } from "elysia";
import bcrypt from "bcrypt";
export const authenCon = {
    register: async (body) => {
        try {
            const { email, password, fullname } = body;
            const exitedUser = await db.oneOrNone("SELECT id FROM public.users WHERE email = $1", [email]);
            if (exitedUser) {
                throw new error("User already exists");
            }
            const passwordHash = bcrypt.hashSync(password, 10);
            const result = await db.one("INSERT INTO public.users (email, password, fullname) VALUES ($1, $2, $3) RETURNING id", [email, password, fullname]);
            return result;
        } catch (error) {
            return {
                error: true,
                message: error.message
            };
            
        }
    },
    login : async (body) => {
        try {
            const { email, password } = body;
            const user = await db.oneOrNone("SELECT * FROM public.users WHERE email = $1", [email]);
            if (!user) {
                throw new error("User not found");
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
            if (!isPasswordValid) {
                throw new error("Invalid password");
            }
            return user;
        } catch (error) {
            return {
                error: true,
                message: error.message
            };
        }
    }
}