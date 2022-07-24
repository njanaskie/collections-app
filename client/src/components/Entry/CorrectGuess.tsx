import { Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { CollectionEntry, CollectionEntryInput } from "../../generated/graphql";
import { ImageNotFound } from "./ImageNotFound";
import theme from "../../theme";

type CorrectGuessProps = {
  entry: CollectionEntryInput;
  isMe: boolean;
  measuredRef: any;
};

export const CorrectGuess: React.FC<CorrectGuessProps> = ({
  entry,
  isMe,
  measuredRef,
}) => {
  return (
    <Flex align="center" flexDirection="column" borderRadius="lg" w="inherit">
      <Flex
        borderRadius="lg"
        borderWidth={!isMe ? 4 : 0}
        borderColor={!isMe ? theme.colors.green : "gray.200"}
      >
        {entry.externalImagePath ? (
          <Image
            borderRadius="md"
            src={`https://image.tmdb.org/t/p/w92${entry.externalImagePath}`}
            ref={measuredRef}
          />
        ) : (
          <ImageNotFound />
        )}
      </Flex>

      <Heading mt={2} size="sm" color="white" textAlign="center" noOfLines={2}>
        {entry.externalTitle}
      </Heading>
    </Flex>
  );
};
