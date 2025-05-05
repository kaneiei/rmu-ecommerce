import { Elysia, t } from "elysia";
import { authenCon } from "../controllers/authen.Con";
import { error } from "elysia";

export const authenRoute = new Elysia({ prefix: "/authen" })
    .post("register", async ({ body }) => {
        try {
            const user = await authenCon.register(body);
            return {
                message: "User registered successfully",
                user,
            };
        } catch (err) {
            console.error("Registration error:", err);
            return error(400, err.message || "Error registering user");
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            fullname: t.String(),
        })
    })
    .post("login", async ({ body }) => {
        try {
            // เรียกฟังก์ชัน login และรอผลลัพธ์
            const user = await authenCon.login(body);
            
            // ถ้าไม่พบผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง
            if (!user) {
                return {
                    success: false,
                    message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
                };
            }
            
            // ล็อกอินสำเร็จ
            return {
                success: true,
                message: "User logged in successfully",
                user,
            };
        } catch (err) {
            console.error("Login error:", err);
            return error(400, err.message || "Error logging in user");
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        })
    });
