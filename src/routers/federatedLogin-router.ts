import { loginWithGitHub } from "@/controllers";
import { validateBody } from "@/middlewares";
import { federatedCodeSchema } from "@/schemas";
import { Router } from "express";

const federatedLoginRouter = Router();

federatedLoginRouter.post("/github/login", validateBody(federatedCodeSchema), loginWithGitHub);

export { federatedLoginRouter };
