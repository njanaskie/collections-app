import React from "react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export const ImageNotFound = () => {
  return (
    <Flex
      width="92px"
      height="138px"
      borderRadius="lg"
      align="center"
      justify="center"
    >
      <WarningTwoIcon w={10} h={10} color="gray.400" />
    </Flex>
  );
};
