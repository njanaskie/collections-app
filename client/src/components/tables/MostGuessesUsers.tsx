import {
  Box,
  Flex,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useMostGuessesUsersQuery } from "../../generated/graphql";
import { StatTable } from "./StatTable";

export const MostGuessesUsers = () => {
  const [{ data, error, fetching }] = useMostGuessesUsersQuery();

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
      ) : !fetching && data?.mostGuessesUsers.length === 0 ? (
        <Box>Ain't no collections to be found :(</Box>
      ) : (
        <StatTable
          caption="Users with most correct guesses"
          tableHeaders={["User", "Correct Guesses"]}
          data={data?.mostGuessesUsers}
        />
      )}
    </Flex>
  );
};
