import { Flex, Button, Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { CollectionSnippetFragment } from "../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../theme";

interface CardProps {
  c: CollectionSnippetFragment;
  size?: string;
}

export const Card: React.FC<CardProps> = ({ c, size }) => {
  return (
    <Flex
      direction="column"
      p={4}
      shadow="md"
      borderWidth="1px"
      borderColor="gray.200"
      h={size === "small" ? [230, 250] : [280, 300]}
      w={size === "small" ? [150, 200] : [200, 250]}
      justifyContent="space-between"
      backgroundColor="gray.200"
      borderRadius={4}
    >
      <Box>
        <NextLink href="/collection/[id]" as={`/collection/${c.id}`}>
          <Link>
            <Heading fontSize="lg" color={theme.colors.darkBlue} noOfLines={8}>
              {c.titleSnippet}
            </Heading>
            {/* <Heading fontSize="md" color={theme.colors.darkBlue}>
              {c.id}
            </Heading> */}
          </Link>
        </NextLink>
      </Box>
      <CardBottom collection={c} />
    </Flex>
  );
};
