import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React from "react";
import { correctGuessMessages, incorrectGuessMessages } from "../constants";
import { randomSelector } from "../utils/randomSelector";

interface GuessMessageAlertProps {
  guessMessageState: string;
}

export const GuessMessageAlert: React.FC<GuessMessageAlertProps> = ({
  guessMessageState,
}) => {
  if (guessMessageState === "correct") {
    return (
      <Tag colorScheme="whatsapp">
        <TagLeftIcon as={CheckIcon} />
        <TagLabel>{randomSelector(correctGuessMessages)}</TagLabel>
      </Tag>
    );
  }

  if (guessMessageState === "incorrect") {
    return (
      <Tag colorScheme="red" alignContent="center">
        <TagLeftIcon as={SmallCloseIcon} />
        <TagLabel>{randomSelector(incorrectGuessMessages)}</TagLabel>
      </Tag>
    );
  }

  return null;
};
