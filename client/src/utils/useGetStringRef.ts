import { useRouter } from "next/router";
import { isServer } from "./isServer";

export const useGetStringRef = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? router.query.id.toString() : "-1";

  if (isServer()) return intId;

  if (intId && intId !== "-1") {
    localStorage.setItem("queryId", intId.toString());
    return intId;
  } else {
    const localId = localStorage.getItem("queryId");
    return typeof localId === "string" ? router.query.id?.toString() : "-1";
  }
};
