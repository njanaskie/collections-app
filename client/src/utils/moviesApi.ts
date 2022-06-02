import { API_BASE_URL, API_KEY } from "../config/movies-api";
import cacheData from "memory-cache";

export const apiFetch = (url: string) => {
  return fetch(url);
};

export const getSearch = (query: string) => {
  return fetch(`${API_BASE_URL}search/movie?api_key=${API_KEY}&query=${query}`);
};

export const getConfiguration = () => {
  return fetch(`${API_BASE_URL}configuration?api_key=${API_KEY}`);
};

export const fetchWithCache = async (url: any, options: any) => {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const hours = 24;
    const res = await fetch(url, options);
    const data = await res.json();
    cacheData.put(url, data, hours * 1000 * 60 * 60);
    return data;
  }
};
