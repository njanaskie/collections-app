import { ChevronLeftIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import theme from "../theme";

export const BackButton = () => {
  return (
    <IconButton
      size="sm"
      bgColor="gray.200"
      aria-label="Go back"
      icon={<ChevronLeftIcon color={theme.colors.darkBlue} />}
      onClick={() => router.back()}
      mr={4}
      alignSelf="center"
    />
  );
};
