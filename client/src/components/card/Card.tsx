import { Flex, Button, Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { CollectionSnippetFragment } from "../../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../../theme";
import { motion } from "framer-motion";

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
      w={size === "small" ? ["auto", 240, 240, 240] : undefined}
      justifyContent="space-between"
      backgroundColor={theme.colors.superLightBlue}
      borderRadius={6}
      key={c.id}
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
              noOfLines={size === "small" ? [3, 6] : [3, 8]}
              _hover={{
                textColor: theme.colors.lightBlue,
              }}
              // overflow='clip'
            >
              {c.titleSnippet?.length === 150
                ? c.titleSnippet + "..."
                : c.titleSnippet}
            </Text>
            {/* <Heading fontSize="md" color={theme.colors.darkBlue}>
              {c.id}
            </Heading> */}
          </Link>
        </NextLink>
      </Box>
      <CardBottom collection={c} size={size} />
    </Flex>
    // </motion.a>
  );
};
