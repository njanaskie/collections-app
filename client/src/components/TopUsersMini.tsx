import {
  Avatar,
  Box,
  Flex,
  Spinner,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useMostVotesUsersQuery } from "../generated/graphql";

// interface PointsProps {
//   collection: CollectionSnippetFragment;
// }

export const TopUsersMini = () => {
  const [{ data, error, fetching }] = useMostVotesUsersQuery();

  console.log("top users mini", data);
  const colorSchemes = [
    "gray",
    "red",
    "yellow",
    "teal",
    "blue",
    "cyan",
    "pink",
    "whatsapp",
  ];

  if (!fetching && !data) {
    return (
      <div>
        <div>your query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Flex alignItems="center">
      {!data && fetching ? (
        <Spinner />
      ) : !fetching && data?.mostVotesUsers.length === 0 ? (
        <Box>Ain't no collections to be found :(</Box>
      ) : (
        data?.mostVotesUsers.map((u) => {
          return (
            <Tag
              size="lg"
              colorScheme={
                colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
              }
              borderRadius="full"
              mr={2}
            >
              <TagLabel>{u.username}</TagLabel>
              <TagLabel>{u.stat}</TagLabel>
            </Tag>
          );
        })
      )}
    </Flex>
  );
};
