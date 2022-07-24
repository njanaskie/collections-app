import { Flex, Button, Text, Divider } from "@chakra-ui/react";
import React from "react";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";
import NextLink from "next/link";
import { Points } from "./Points";

interface CardBottomProps {
  collection: CollectionSnippetFragment;
}

export const CardBottom: React.FC<CardBottomProps> = ({ collection }) => {
  const [{ fetching }, vote] = useVoteMutation();
  return (
    <Flex
      key={collection.id}
      justifyContent="space-between"
      alignItems="center"
    >
      <Points collection={collection} />
      <NextLink
        href={{
          pathname: "/user/[username]",
          query: { id: collection.creator.id },
        }}
        as={`/user/${collection.creator.username}`}
      >
        <Button color="gray.600" variant="ghost">
          {collection.creator.username}
        </Button>
      </NextLink>
    </Flex>
  );
};
