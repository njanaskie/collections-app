import { Box, Flex, Spinner } from "@chakra-ui/react";
import React from "react";
import { useMostCreatedCollectionsUsersQuery } from "../../generated/graphql";
import { StatTable } from "./StatTable";

export const MostCreatedCollectionsUsers = () => {
  const [{ data, error, fetching }] = useMostCreatedCollectionsUsersQuery();

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
      ) : !fetching && data?.mostCreatedCollectionsUsers.length === 0 ? (
        <Box>Most created collections stat can't be found</Box>
      ) : (
        <StatTable
          caption="Collections created"
          tableHeaders={["User", "Collections"]}
          data={data?.mostCreatedCollectionsUsers}
        />
      )}
    </Flex>
  );
};
