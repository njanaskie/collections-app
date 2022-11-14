import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";
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
        <Flex justify="flex-start" wrap="wrap">
          {data.length > 0 ? (
            data.map((i: any) => (!i ? null : item(i)))
          ) : (
            <Text color="gray.200">Nothing here...</Text>
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
