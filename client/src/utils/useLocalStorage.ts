import { useState, useEffect } from "react";
import { isServer } from "./isServer";

function getStorageValue(key: string, defaultValue: any) {
  if (isServer()) return defaultValue;

  // getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved ? JSON.parse(saved) : [];
    return initial || defaultValue;
  }
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
