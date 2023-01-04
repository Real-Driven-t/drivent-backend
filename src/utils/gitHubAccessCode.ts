import { parse } from "path";
import { request } from "./request";

async function exchangeCodeForAccessToken(code: string) {
  const GITHUB_ACCESS_CODE_URL = "https://github.com/login/oauth/access_token";
  const GITHUB_USER_URL = "https://api.github.com/user";

  const params = {
    code,
    client_id: process.env.CLIENT_ID,
    redirect_uri: process.env.REDIRECT_URI,
    client_secret: process.env.CLIENT_SECRET,
  };

  const response = await request.post(GITHUB_ACCESS_CODE_URL, params);

  const parsedData = new URLSearchParams(response.data);
  const token = parsedData.get("access_token");

  const userResponse = await request.getWithHeader(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(userResponse.data.email);

  const userEmail = userResponse.data.email;

  return { userEmail, token };
}

export { exchangeCodeForAccessToken };
