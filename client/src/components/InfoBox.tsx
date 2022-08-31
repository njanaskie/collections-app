import {
  Flex,
  Button,
  Text,
  Box,
  Heading,
  Link,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import React from "react";
import {
  Collection,
  CollectionResponse,
  CollectionSnippetFragment,
  CorrectGuess,
  MyCorrectGuessesQuery,
  RegularCollectionFragment,
} from "../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../theme";
import { EditDeleteCollectionButtons } from "./EditDeleteCollectionButtons";
import { Points } from "./Points";
import { CorrectGuessItem } from "../utils/CorrectGuessItemProps";

interface InfoBoxProps {
  collection: RegularCollectionFragment;
  isMe: boolean;
  correctGuesses: CorrectGuessItem[];
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  collection,
  isMe,
  correctGuesses,
}) => {
  return (
    <Flex
      direction="column"
      ml={4}
      // mb={4}
      p={2}
      backgroundColor={theme.colors.lightPurple}
      borderRadius={6}
      borderWidth={1}
      minW={60}
      h={40}
      borderColor="gray.200"
    >
      {isMe ? <EditDeleteCollectionButtons id={collection.id} /> : null}
      <Flex>
        {collection.guesserCompleteness ? (
          <CircularProgress
            value={collection.guesserCompleteness * 100}
            color={theme.colors.green}
            size={50}
          >
            <CircularProgressLabel>
              {collection.guesserCompleteness * 100}%
            </CircularProgressLabel>
          </CircularProgress>
        ) : null}

        {!isMe ? (
          <Text ml={2} alignSelf="center" color="gray.600">
            <b>{correctGuesses?.length}</b> out of{" "}
            <b>{collection.collectionEntries.length}</b> films guessed correctly
          </Text>
        ) : null}
      </Flex>
      <Points collection={collection} />
    </Flex>
  );
};
