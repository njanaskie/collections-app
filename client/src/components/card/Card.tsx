import { Box, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { CollectionSnippetFragment } from "../../generated/graphql";
import theme from "../../theme";
import { CardBottom } from "./CardBottom";

interface CardProps {
  c: CollectionSnippetFragment;
  size?: string;
}

export const Card: React.FC<CardProps> = ({ c, size }) => {
  return (
    // <motion.a
    //   whileHover={{ scale: 1.1 }}
    //   transition={{ type: "spring", stiffness: 400, damping: 10 }}
    // >
    <Flex
      direction="column"
      boxShadow="md"
      rounded="md"
      borderWidth="2px"
      borderColor="gray.400"
      h={size === "small" ? ["auto", 240] : [260, 260]}
      w={size === "small" ? ["100%", 240, 240, 240] : undefined}
      justifyContent="space-between"
      backgroundColor={theme.colors.superLightBlue}
      borderRadius={6}
      key={c.id}
      // flexGrow={size === "small" ? "inherit" : undefined}
    >
      <Box p={4}>
        <NextLink href="/collection/[id]" as={`/collection/${c.reference}`}>
          <Link
            _hover={{
              textDecoration: "none",
            }}
          >
            <Text
              fontWeight="semibold"
              color={theme.colors.darkBlue}
              noOfLines={size === "small" ? [3, 8] : 7}
              _hover={{
                textColor: theme.colors.lightBlue,
              }}
            >
              {c.titleSnippet?.length === 250
                ? c.titleSnippet + "..."
                : c.titleSnippet}
            </Text>
          </Link>
        </NextLink>
      </Box>
      {/* 
        disabled cardbottom when small bc going directly to another user page caused hydration issues
      */}
      {size === "small" ? null : <CardBottom collection={c} size={size} />}
    </Flex>
    // </motion.a>
  );
};
