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

interface ItemStackProps {
  data: any;
  hasMore: boolean;
  fetching: boolean;
  handleFetchMore: Function;
  page: number;
  queryType: string;
  item: any;
}

export const ItemStack: React.FC<ItemStackProps> = ({
  data,
  hasMore,
  fetching,
  page,
  handleFetchMore,
  queryType,
  item,
}) => {
  const prevPage = usePrevious(page);

  const fetchMore = () => {
    handleFetchMore(queryType, prevPage + 1);
  };

  return (
    <>
      {!data && fetching ? (
        <Spinner />
      ) : (
        <Flex justify="space-between" wrap="wrap">
          {data.length > 0 ? (
            data.map((i: any) =>
              !i ? (
                <div>null i</div>
              ) : (
                <Flex key={i.id} m={2}>
                  {item(i)}
                </Flex>
              )
            )
          ) : (
            <div>nothing here</div>
          )}
        </Flex>
      )}
      {data && hasMore ? (
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
