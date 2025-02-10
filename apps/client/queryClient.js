// import ky from "ky";
import { request } from "graphql-request";

const URL = "http://localhost:8000/graphql";

// const apiInstance = ky.create({ prefixUrl: "http://localhost:8000" });

// export const fetcher = async (method, url, ...rest) => {
//   const res = await apiInstance[method](url, ...rest);
//   const result = await res.json();
//   return result;
// };

export const fetcher = (query, variables = {}) =>
  request(URL, query, variables);

export const QueryKeys = {
  MESSAGES: ["MESSAGES"],
  MESSAGE: ["MESSAGE"],
  USERS: ["USERS"],
  USER: ["USER"],
};
