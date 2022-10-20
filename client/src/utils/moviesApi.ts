import { API_BASE_URL, API_KEY } from "../config/movies-api";
import cacheData from "memory-cache";

export const apiFetch = (url: string) => {
  return fetch(url);
};

export const getSearch = (query: string, page: number) => {
  return fetch(
    `${API_BASE_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
  );
};

export const getConfiguration = async () => {
  const res = await fetch(`${API_BASE_URL}configuration?api_key=${API_KEY}`);
  const data = await res.json();

  return data;
};

export const getConfigurationWithCache = () => {
  const res = fetchWithCache(`${API_BASE_URL}configuration?api_key=${API_KEY}`);
  return res;
};

export const fetchWithCache = async (url: any, options?: any) => {
  const value = cacheData.get(url);
  if (value) {
    console.log("cache value", value);
    return value;
  } else {
    const hours = 24;
    const res = await fetch(url, options);
    const data = await res.json();
    console.log("cache data", data);
    cacheData.put(url, data, hours * 1000 * 60 * 60);
    return data;
  }
};
