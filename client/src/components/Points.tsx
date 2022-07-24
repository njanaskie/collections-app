import { Flex, Button, Text, Divider } from "@chakra-ui/react";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";

interface PointsProps {
  collection: CollectionSnippetFragment;
}

export const Points: React.FC<PointsProps> = ({ collection }) => {
  const [{ fetching }, vote] = useVoteMutation();
  return (
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
  );
};
