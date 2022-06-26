import { useEffect, useRef } from "react";

export const usePrevious = (value: any) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
