import { Elysia, t } from "elysia";
import { authenCon } from "../controllers/authen.Con";
import { db } from "../db.config.";
import bcrypt from "bcrypt";
import { error } from "elysia";

export const authenRoute = new Elysia({ prefix: "/authen" })
    .post("register", ({ body }) => {
        const register = authenCon.register(body);
        if (register) {
            return {
                message: "User registered successfully",
                user: register,
            };
        } else {
            return {
                message: "Error registering user",
            };
        }
    }, {

        body: t.Object({
            email: t.String(),
            password: t.String(),
            fullname: t.String(),
        })
    })
    .post("login", async ({ body }) => {
        const { email, password } = body;
        const user = await db.oneOrNone("SELECT * FROM public.users WHERE email = $1", [email]);
        if (!user) {
            return {
                message: "User not found",
            };
        }
        const isPasswordValid =  bcrypt.compareSync(password, user.password_hash);
        if (!isPasswordValid) {
            return {
                message: "Invalid password",
            };
        }
        if (user) {
            return {
                message: "User logged in successfully",
                user,
            };
        } else {
            return {
                message: "Error logging in user",
            };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
    });
