import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Tag,
  TagLabel,
  Tbody,
  Thead,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React from "react";
import { Layout } from "../components/Layout";
import { MostGuessesUsers } from "../components/tables/MostGuessesUsers";
import { MostVotesUsers } from "../components/tables/MostVotesUsers";
import { useMostVotesUsersQuery } from "../generated/graphql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const Leaderboard = () => {
  return (
    <Layout>
      <IconButton
        bgColor="gray.200"
        aria-label="Go back"
        icon={<ChevronLeftIcon />}
        onClick={() => router.back()}
      />
      <Heading size="lg" color={theme.colors.orange} mt={4} mb={4}>
        Top Players
      </Heading>
      <Divider mb={6} />
      <Flex>
        <MostVotesUsers />
        <MostGuessesUsers />
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Leaderboard);
