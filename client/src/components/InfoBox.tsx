import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
  Tooltip,
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
  const completeStat = Math.round(
    (correctGuesses.length / collection.collectionEntriesLength) * 100
  );
  return (
    <Flex
      direction="column"
      // ml={4}
      // mb={4}
      p={2}
      backgroundColor={theme.colors.lightPurple}
      borderRadius={6}
      borderWidth={1}
      // w={"auto"}
      h={["auto", "auto", 40]}
      borderColor="gray.200"
      justify="space-between"
    >
      {isMe ? (
        <EditDeleteCollectionButtons
          id={collection.id}
          reference={collection.reference}
        />
      ) : null}
      <Flex align="center">
        {correctGuesses && collection.collectionEntriesLength && !isMe ? (
          <CircularProgress
            value={completeStat}
            color={completeStat === 100 ? theme.colors.green : "gray.500"}
            size={50}
          >
            <CircularProgressLabel as="b">
              {completeStat}%
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
      <Flex align={"center"}>
        <Tooltip
          label={`Liked by ${collection.points} ${
            collection.points === 1 ? "player" : "players"
          } `}
          fontSize="sm"
          placement="auto"
        >
          <Flex>
            <Points
              id={collection.id}
              voteStatus={collection.voteStatus}
              points={collection.points}
            />
          </Flex>
        </Tooltip>
        <Tooltip
          label={`Completed by ${collection.usersCompletedCount} ${
            collection.usersCompletedCount === 1 ? "player" : "players"
          } `}
          fontSize="sm"
          placement="auto"
        >
          <Flex align={"center"}>
            <Flex
              bg="gray.200"
              borderRadius={50}
              borderWidth={1}
              borderColor="gray.200"
            >
              <CheckCircleIcon
                color={
                  collection.usersCompletedCount === 0
                    ? "gray.500"
                    : theme.colors.green
                }
                opacity="70%"
              />
            </Flex>
            <Text ml={2} color="gray.600">
              {collection.usersCompletedCount}
            </Text>
          </Flex>
        </Tooltip>
      </Flex>
      {/* <Save collection={collection} /> */}
    </Flex>
  );
};
