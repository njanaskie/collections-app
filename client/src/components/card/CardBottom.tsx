import { Button, Flex, Icon, Text, Tooltip } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IoAlbumsOutline } from "react-icons/io5";
import { CollectionSnippetFragment } from "../../generated/graphql";
import theme from "../../theme";
import { Points } from "../Points";

interface CardBottomProps {
  collection: CollectionSnippetFragment;
  size?: string;
}

export const CardBottom: React.FC<CardBottomProps> = ({ collection, size }) => {
  return (
    <Flex
      key={collection.id}
      justifyContent="space-between"
      alignItems="center"
      bgColor="gray.300"
      px={4}
      py={2}
      borderBottomRadius={6}
    >
      <Points
        id={collection.id}
        voteStatus={collection.voteStatus}
        points={collection.points}
        size={size}
      />
      <Flex align="center">
        <Flex>
          {collection.collectionEntriesLength && (
            <Tooltip
              label={
                collection.collectionEntriesLength > 1
                  ? `${collection.collectionEntriesLength} films`
                  : `${collection.collectionEntriesLength} film`
              }
              fontSize="md"
            >
              <Flex w="100%" h="100%">
                <Text
                  pos="relative"
                  left={"32px"}
                  top={"16px"}
                  as="b"
                  color={"teal"}
                  fontSize="sm"
                >
                  {collection.collectionEntriesLength}
                </Text>
                <Icon
                  as={IoAlbumsOutline}
                  h={10}
                  w={10}
                  style={{ transform: "rotate(270deg)" }}
                  color={"teal"}
                />
              </Flex>
            </Tooltip>
          )}
        </Flex>
        <NextLink
          href={{
            pathname: "/user/[username]",
            query: { id: collection.creator.id },
          }}
          as={`/user/${collection.creator.username}`}
        >
          <Button
            color={theme.colors.darkBlue}
            variant="unstyled"
            ml={2}
            _hover={{ textColor: theme.colors.lightBlue }}
          >
            {collection.creator.username}
          </Button>
        </NextLink>
      </Flex>
    </Flex>
  );
};
