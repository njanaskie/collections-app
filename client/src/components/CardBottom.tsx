import { Flex, Button, Text } from "@chakra-ui/react";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

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
        >
          {collection.voteStatus === 1 ? <IoMdHeart /> : <IoMdHeartEmpty />}
        </Button>
        {collection.points}
      </Flex>
      <Text>{collection.creator.username}</Text>
    </Flex>
  );
};
