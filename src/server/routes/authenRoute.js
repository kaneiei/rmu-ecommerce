import { Elysia, t } from "elysia";
import { authenController } from "../controllers/authen.controller";

export const authenRoute = new Elysia({ prefix: "/authen" })
  .post(
    "register",
    ({ body, set }) => {
      const register = authenController.register(body);

      if (!register) {
        return {
          message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
        };
      }

      if (register.error) {
        set.status(400);
        return {
          message: register.message,
          error: true,
        };
      }

      return register;
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        fullName: t.String(),
      }),
    }
  )
  .post(
    "login",
    ({ body }) => {
      return authenController.login(body);
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );