import { notFoundError } from "@/errors";
import sessionRepository from "@/repositories/session-repository";
import userRepository from "@/repositories/user-repository";
import { exchangeCodeForAccessToken } from "@/utils/gitHubAccessCode";
import { User } from "@prisma/client";
import { SignInResult } from "../authentication-service";

async function signInWithGitHub(code: string): Promise<SignInResult> {
  const { userEmail, token } = await exchangeCodeForAccessToken(code);

  if (!userEmail || !token) {
    throw notFoundError();
  }

  let user = await getUserOrFail(userEmail);

  if (!user) {
    const { id, email } = await userRepository.create({
      email: userEmail,
    });

    user = {
      id,
      email,
    };
  }

  await sessionRepository.create({
    token,
    userId: user.id,
  });

  return {
    user,
    token,
  };
}

async function getUserOrFail(email: string): Promise<GetUserOrFailResult> {
  const user = await userRepository.findByEmail(email, { id: true, email: true });

  return user;
}

const federatedLoginService = {
  signInWithGitHub,
};

export default federatedLoginService;

export type FederetedCode = {
  code: string;
};

type GetUserOrFailResult = Pick<User, "id" | "email">;
