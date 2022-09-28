import { Flex, Button, Text, Box, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { CollectionSnippetFragment } from "../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../theme";
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
      h={size === "small" ? [200, 240] : [200, 260]}
      w={size === "small" ? [200, 240] : [200, 260]}
      justifyContent="space-between"
      backgroundColor={theme.colors.superLightBlue}
      borderRadius={6}
      // _hover={{ bgColor: theme.colors.lightPurple }}
    >
      <Box p={4}>
        <NextLink href="/collection/[id]" as={`/collection/${c.id}`}>
          <Link
            _hover={{
              textDecoration: "none",
            }}
          >
            <Text
              fontWeight="semibold"
              color={theme.colors.darkBlue}
              noOfLines={size === "small" ? 5 : 7}
              _hover={{
                textColor: theme.colors.orange,
              }}
            >
              {c.titleSnippet}
            </Text>
            {/* <Heading fontSize="md" color={theme.colors.darkBlue}>
              {c.id}
            </Heading> */}
          </Link>
        </NextLink>
      </Box>
      <CardBottom collection={c} />
    </Flex>
    // </motion.a>
  );
};
