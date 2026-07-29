export const getApiBaseUrl = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_MY_PC_STORE_API_BASE_URL ?? "http://localhost:3003";

  return baseUrl.replace(/\/$/, "");
};

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};
