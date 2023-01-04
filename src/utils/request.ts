import axios from "axios";
import { requestError } from "@/errors";

async function get(url: string) {
  try {
    const result = await axios.get(url);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

async function getWithHeader(url: string, headers: object) {
  try {
    const result = await axios.get(url, headers);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

async function post(url: string, body: object) {
  try {
    const result = await axios.post(url, body);
    return result;
  } catch (error) {
    const { status, statusText } = error.response;

    return requestError(status, statusText);
  }
}

export const request = {
  get,
  getWithHeader,
  post,
};
