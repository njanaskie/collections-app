import React from "react";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";

export const ImageNotFound = () => {
  return (
    <Flex
      width="92px" // TODO: make these dynamic using the measured dimensions
      height="138px"
      borderRadius="lg"
      // flex={1}
      // alignContent="center"
      // borderWidth="4px"
      // borderColor="gray.400"
      align="center"
      justify="center"
    >
      <WarningTwoIcon w={10} h={10} color="gray.400" />
    </Flex>
  );
};
