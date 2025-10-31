export const apiUrl = (path: string, apiVersion = "1.0") => {
  const origin =
    import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const sanitizedOrigin = origin.replace(/\/$/, "");
  const sanitizedPath = path.replace(/^\//, "");

  return `${sanitizedOrigin}/api/v${apiVersion}/${sanitizedPath}`;
};
