import { Flex, Button, Text, Divider } from "@chakra-ui/react";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../generated/graphql";
import theme from "../theme";

interface PointsProps {
  collection: CollectionSnippetFragment;
}

export const Points: React.FC<PointsProps> = ({ collection }) => {
  const [{ fetching }, vote] = useVoteMutation();
  return (
    <Flex>
      <Button
        justifyContent="center"
        onClick={async () => {
          await vote({ collectionId: collection.id });
        }}
        size="md"
        variant="ghost"
        aria-label="like collection"
        isLoading={fetching}
        color="gray.600"
        _hover={{ textDecoration: "none" }}
        _active={{ textDecoration: "none" }}
        leftIcon={
          collection.voteStatus === 1 ? (
            <IoMdHeart color={theme.colors.rose} />
          ) : (
            <IoMdHeartEmpty />
          )
        }
        w={"80%"}
      >
        {collection.points}
      </Button>
    </Flex>
  );
};
