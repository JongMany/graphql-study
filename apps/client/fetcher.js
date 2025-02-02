import ky from "ky";
const apiInstance = ky.create({ prefixUrl: "http://localhost:8000" });

export const fetcher = async (method, url, ...rest) => {
  const res = await apiInstance[method](url, ...rest);
  const result = await res.json();
  return result;
};
