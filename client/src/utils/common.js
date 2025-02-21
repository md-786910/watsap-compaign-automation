const isProd = import.meta.env.MODE === "production";
const uri = isProd ? "http://13.233.71.54:3000":"http://localhost:3000";
export const API = `${uri}/api/v1`;
export const SERVER_FILE_API = `${uri}/uploads`;
export const SOCKET_API = `${uri}`;
