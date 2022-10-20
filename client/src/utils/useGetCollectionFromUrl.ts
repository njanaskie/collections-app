import { useCollectionQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";
import { useGetStringRef } from "./useGetStringRef";

export const useGetCollectionFromUrl = () => {
  // const intId = useGetIntId();
  const intId = useGetStringRef();
  return useCollectionQuery({
    // pause: intId === -1,
    pause: intId === "-1",
    variables: {
      // id: intId,
      reference: intId,
    },
  });
};
