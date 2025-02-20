const isProduction = import.meta.env.VITE_NODE_ENV == "production";

const url = isProduction
  ? import.meta.env.VITE_SERVER_PROD_URL
  : import.meta.env.VITE_SERVER_DEV_URL;

export const API = `${url}/api/v1`;
export const SERVER_FILE_API = `${url}/uploads`;
export const SOCKET_API = url;
