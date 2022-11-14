import { Box, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { useMostCompletedCollectionsUsersQuery } from "../../generated/graphql";
import { StatTable } from "./StatTable";

export const MostCompletedCollectionsUsers = () => {
  const [{ data, error, fetching }] = useMostCompletedCollectionsUsersQuery();

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
      ) : !fetching && data?.mostCompletedCollectionsUsers.length === 0 ? (
        <Box>Most completed collections stat can't be found</Box>
      ) : (
        <StatTable
          caption="Collections completed"
          tableHeaders={["User", "Collections"]}
          data={data?.mostCompletedCollectionsUsers}
        />
      )}
    </Flex>
  );
};
