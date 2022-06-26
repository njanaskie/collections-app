import {
  Flex,
  Button,
  Text,
  Box,
  Heading,
  Link,
  Stack,
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

interface CardStackProps {
  data: UserPaginatedCollectionsFragment;
}

export const CardStack: React.FC<CardStackProps> = ({ data }) => {
  return (
    <Stack>
      {data.collections.map((c) => (!c ? null : <Card c={c} key={c.id} />))}
    </Stack>
  );
};
