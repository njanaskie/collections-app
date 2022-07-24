import {
  Flex,
  Button,
  Text,
  Box,
  Heading,
  Link,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import React from "react";
import {
  PaginatedCollections,
  UserCollectionSnippetFragment,
  UserPaginatedCollectionsFragment,
} from "../generated/graphql";
import NextLink from "next/link";
import { CardBottom } from "./CardBottom";
import theme from "../theme";
import { Card } from "./Card";
import { Layout } from "./Layout";
import { usePrevious } from "../utils/usePrevious";

interface CardStackProps {
  data: UserPaginatedCollectionsFragment;
  fetching: boolean;
  handleFetchMore: Function;
  page: number;
  collectionType: string;
}

export const CardStack: React.FC<CardStackProps> = ({
  data,
  fetching,
  page,
  handleFetchMore,
  collectionType,
}) => {
  const prevPage = usePrevious(page);

  const fetchMore = () => {
    handleFetchMore(collectionType, prevPage + 1);
  };

  return (
    <>
      {!data && fetching ? (
        <Spinner />
      ) : (
        <Flex wrap="wrap">
          {data.collections.length > 0 ? (
            data.collections.map((c) =>
              !c ? (
                <div>null c</div>
              ) : (
                <Flex key={c.id} m={2}>
                  <Card c={c} size="small" />
                </Flex>
              )
            )
          ) : (
            <div>nothing here</div>
          )}
        </Flex>
      )}
      {data && data.hasMore ? (
        <Flex>
          <Button
            onClick={fetchMore}
            isLoading={fetching}
            m="auto"
            my={8}
            color={theme.colors.darkBlue}
            bgColor={theme.colors.gold}
            _hover={{ bg: theme.colors.darkGold }}
            _active={{ bg: theme.colors.gold }}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </>
  );
};
