const _apiUrl  = import.meta.env.VITE_API_URL  ?? "";
const _baseUrl = import.meta.env.BASE_URL       ?? "/";

export const env = {
  get apiUrl()  { return _apiUrl; },
  get baseUrl() { return _baseUrl; },
  get isDev()   { return import.meta.env.DEV; },
  get isProd()  { return import.meta.env.PROD; },
} as const;
