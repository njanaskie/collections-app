import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { RegularCollectionFragment } from "../generated/graphql";
import theme from "../theme";
import { CorrectGuessItem } from "../utils/CorrectGuessItemProps";
import { EditDeleteCollectionButtons } from "./EditDeleteCollectionButtons";
import { Points } from "./Points";

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
      // ml={4}
      // mb={4}
      p={2}
      backgroundColor={theme.colors.lightPurple}
      borderRadius={6}
      borderWidth={1}
      minW={[40, 60]}
      h={["auto", 40]}
      borderColor="gray.200"
      justify="space-between"
    >
      {isMe ? (
        <EditDeleteCollectionButtons
          id={collection.id}
          reference={collection.reference}
        />
      ) : null}
      <Flex>
        {correctGuesses && collection.collectionEntriesLength ? (
          <CircularProgress
            value={Math.round(
              (correctGuesses.length / collection.collectionEntriesLength) * 100
            )}
            color={theme.colors.green}
            size={50}
          >
            <CircularProgressLabel>
              {Math.round(
                (correctGuesses.length / collection.collectionEntriesLength) *
                  100
              )}
              %
            </CircularProgressLabel>
          </CircularProgress>
        ) : null}

        {!isMe ? (
          <Text ml={2} alignSelf="center" color="gray.600">
            <b>{correctGuesses?.length}</b> out of{" "}
            <b>{collection.collectionEntries.length}</b> films guessed correctly
          </Text>
        ) : (
          <Text ml={2} alignSelf="center" color="gray.600">
            <b>{collection.collectionEntries.length}</b>{" "}
            {collection.collectionEntries.length === 1 ? "film" : "films"} in
            this collection
          </Text>
        )}
      </Flex>
      <Flex>
        <Points
          id={collection.id}
          voteStatus={collection.voteStatus}
          points={collection.points}
        />
      </Flex>
      {/* <Save collection={collection} /> */}
    </Flex>
  );
};
