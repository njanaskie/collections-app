import { Badge, Box, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { API_IMAGE_URL, API_LOGO_SIZE_SM } from "../../config/movies-api";
import { Appeal } from "../../generated/graphql";
import theme from "../../theme";

interface AppealsItemProps {
  appeal: Appeal;
  children: any;
}

export const AppealsItem: React.FC<AppealsItemProps> = ({
  appeal,
  children,
}) => {
  console.log("appea", appeal);
  return (
    <Flex
      p={4}
      borderWidth={0.5}
      borderRadius={20}
      h={150}
      w={350}
      bgColor="gray.700"
    >
      <Image
        src={`${API_IMAGE_URL}${API_LOGO_SIZE_SM}${appeal.externalImagePath}`}
      />
      <Flex flexDir="column" justify="space-between" w={"100%"}>
        <Flex flexDir="row" justify="space-between">
          <Box>
            <Heading size="md" ml={2} noOfLines={2} color="white">
              {appeal.externalTitle}
            </Heading>
            <Text ml={2} noOfLines={3} color="white">
              ({appeal.externalReleaseDate.slice(0, 4)})
            </Text>
          </Box>
          {children}
        </Flex>
        {appeal.collection.titleSnippet && (
          <Heading ml={2} noOfLines={3} color="white" size="xs" pr={2}>
            <NextLink
              href="/collection/[id]"
              as={`/collection/${appeal.collection.reference}`}
            >
              <Link _hover={{ color: theme.colors.orange }}>
                <Text as="i" fontSize="sm">
                  From:{" "}
                  {appeal.collection.titleSnippet.length >= 20
                    ? appeal.collection.titleSnippet.substr(0, 20) + "\u2026"
                    : appeal.collection.titleSnippet}
                </Text>
              </Link>
            </NextLink>
          </Heading>
        )}
      </Flex>
    </Flex>
  );
};
