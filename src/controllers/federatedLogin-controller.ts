import federetedLoginService, { FederetedCode } from "@/services/federetedLogin-service";
import { Request, Response } from "express";
import httpStatus from "http-status";

export async function loginWithGitHub(req: Request, res: Response) {
  const { code } = req.body as FederetedCode;

  try {
    const result = await federetedLoginService.signInWithGitHub(code);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).send({});
  }
}
