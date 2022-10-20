import { Flex, Button, Text, Divider, Tooltip, Icon } from "@chakra-ui/react";
import React from "react";
import {
  CollectionSnippetFragment,
  useVoteMutation,
} from "../../generated/graphql";
import NextLink from "next/link";
import { Points } from "../Points";
import theme from "../../theme";
import { IoAlbumsOutline } from "react-icons/io5";

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
          {collection.collectionEntriesLength && (
            <Tooltip
              label={
                collection.collectionEntriesLength > 1
                  ? `${collection.collectionEntriesLength} films`
                  : `${collection.collectionEntriesLength} film`
              }
              fontSize="md"
            >
              <Flex>
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
