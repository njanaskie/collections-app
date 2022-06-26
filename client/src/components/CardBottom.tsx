import { Flex, Button, Text } from "@chakra-ui/react";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";
import NextLink from "next/link";

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
      <Flex alignItems="center">
        <Button
          onClick={async () => {
            await vote({ collectionId: collection.id });
          }}
          size="sm"
          variant="ghost"
          aria-label="like collection"
          isLoading={fetching}
          color="gray.600"
        >
          {collection.voteStatus === 1 ? <IoMdHeart /> : <IoMdHeartEmpty />}
        </Button>
        <Text color="gray.600">{collection.points}</Text>
      </Flex>
      <NextLink
        href={{
          pathname: "/user/[username]",
          query: { id: collection.creator.id },
        }}
        as={`/user/${collection.creator.username}`}
      >
        <Button color="gray.600">{collection.creator.username}</Button>
      </NextLink>
    </Flex>
  );
};
