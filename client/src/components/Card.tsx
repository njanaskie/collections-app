import { Flex, Button, Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { CollectionSnippetFragment } from "../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../theme";

interface CardProps {
  c: CollectionSnippetFragment;
}

export const Card: React.FC<CardProps> = ({ c }) => {
  return (
    <Flex
      //   key={c.id}
      direction="column"
      p={5}
      shadow="md"
      borderWidth="1px"
      borderColor="gray.200"
      h={300}
      w={250}
      justifyContent="space-between"
      backgroundColor="gray.200"
      borderRadius={4}
    >
      <Box>
        <NextLink href="/collection/[id]" as={`/collection/${c.id}`}>
          <Link>
            <Heading fontSize="lg" color={theme.colors.darkBlue}>
              {c.titleSnippet}
            </Heading>
          </Link>
        </NextLink>
      </Box>
      <CardBottom collection={c} />
    </Flex>
  );
};
