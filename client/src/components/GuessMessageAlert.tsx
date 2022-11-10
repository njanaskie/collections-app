import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { correctGuessMessages, incorrectGuessMessages } from "../constants";
import { randomSelector } from "../utils/randomSelector";

interface GuessMessageAlertProps {
  guessMessageState: string;
}

export const GuessMessageAlert: React.FC<GuessMessageAlertProps> = ({
  guessMessageState,
}) => {
  const [tagLabel, setTagLabel] = useState();

  useEffect(() => {
    let options: string[] = [];
    if (guessMessageState === "correct") {
      options = correctGuessMessages;
    } else if (guessMessageState === "incorrect") {
      options = incorrectGuessMessages;
    }

    setTagLabel(randomSelector(options));
  }, [guessMessageState]);

  let body = null;
  if (guessMessageState === "correct") {
    body = (
      <Tag colorScheme="whatsapp">
        <TagLeftIcon as={CheckIcon} />
        <TagLabel>{tagLabel}</TagLabel>
      </Tag>
    );
  }

  if (guessMessageState === "incorrect") {
    body = (
      <Tag colorScheme="red" alignContent="center">
        <TagLeftIcon as={SmallCloseIcon} />
        <TagLabel>{tagLabel}</TagLabel>
      </Tag>
    );
  }

  return body;
};
