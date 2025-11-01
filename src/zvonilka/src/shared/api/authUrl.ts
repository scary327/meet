import { apiUrl } from "./apiUrl";

export const authUrl = ({
  silent = false,
  returnTo = window.location.href,
} = {}) => {
  return apiUrl(
    `/authenticate?silent=${encodeURIComponent(
      silent
    )}&returnTo=${encodeURIComponent(returnTo)}`
  );
};
