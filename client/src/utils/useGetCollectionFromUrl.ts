import { useCollectionQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetCollectionFromUrl = () => {
  const intId = useGetIntId();
  return useCollectionQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
};
