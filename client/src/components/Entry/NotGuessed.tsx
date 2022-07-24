import React from "react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export const NotGuessed = () => {
  return (
    <Flex
      width="97px"
      height="145px"
      borderRadius="lg"
      borderWidth="4px"
      borderColor="gray.400"
      align="center"
      justify="center"
    >
      <QuestionOutlineIcon w={10} h={10} color="gray.400" />
    </Flex>
  );
};
