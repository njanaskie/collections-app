import { useUserQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetUserFromUrl = () => {
  const intId = useGetIntId();
  const user = useUserQuery({
    pause: intId === -1, // isServer wasn't used before
    variables: {
      id: intId,
    },
  });
  return user;
};
