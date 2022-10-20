import { Flex, Button, Text, Divider } from "@chakra-ui/react";
import React from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import {
  CollectionSnippetFragment,
  RegularCollectionFragment,
  useVoteMutation,
} from "../generated/graphql";
import theme from "../theme";

interface PointsProps {
  id: number;
  voteStatus?: number | null;
  points: number;
  size?: string;
}

export const Points: React.FC<PointsProps> = ({
  id,
  voteStatus,
  points,
  size,
}) => {
  const [{ fetching }, vote] = useVoteMutation();
  return (
    <Flex>
      <Button
        justifyContent="center"
        onClick={async () => {
          await vote({ collectionId: id });
        }}
        size="md"
        variant="ghost"
        aria-label="vote collection"
        isDisabled={size === "small" ? true : false}
        isLoading={fetching}
        color="gray.600"
        _hover={{ textDecoration: "none" }}
        _active={{ textDecoration: "none" }}
        leftIcon={
          voteStatus === 1 ? (
            <IoMdHeart color={theme.colors.rose} />
          ) : (
            <IoMdHeartEmpty />
          )
        }
        w={"80%"}
      >
        {points}
      </Button>
    </Flex>
  );
};
