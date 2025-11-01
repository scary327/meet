export const useIsLoggedIn = () => {
  const getCsrfToken = () => {
    return document.cookie
      .split(";")
      .filter((cookie) => cookie.trim().startsWith("csrftoken="))
      .map((cookie) => cookie.split("=")[1])
      .pop();
  };

  return !!getCsrfToken();
};
