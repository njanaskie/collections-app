import { Box, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { useMostVotesUsersQuery } from "../../generated/graphql";
import { StatTable } from "./StatTable";

export const MostVotesUsers = () => {
  const [{ data, error, fetching }] = useMostVotesUsersQuery();

  if (!fetching && !data) {
    return (
      <div>
        <div>your query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Flex>
      {!data && fetching ? (
        <Spinner />
      ) : !fetching && data?.mostVotesUsers.length === 0 ? (
        <Box>Most likes stat can't be found</Box>
      ) : (
        <StatTable
          caption="Users with most likes received"
          tableHeaders={["User", "Likes"]}
          data={data?.mostVotesUsers}
        />
      )}
    </Flex>
  );
};
