import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { BackButton } from "../components/BackButton";
import { Layout } from "../components/Layout";
import { MostGuessesUsers } from "../components/tables/MostGuessesUsers";
import { MostVotesUsers } from "../components/tables/MostVotesUsers";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const Leaderboard = () => {
  return (
    <Layout>
      <Flex align="center" mb={4}>
        <BackButton />
        <Heading size="lg" color={theme.colors.orange} ml={6}>
          Top Players
        </Heading>
      </Flex>
      <Text color={"gray.200"} mb={2}>
        Why not celebrate our most dedicated players?
      </Text>
      <Divider mb={6} />
      <Flex justify="space-evenly" wrap="wrap" overflow="scroll">
        <MostVotesUsers />
        <MostGuessesUsers />
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Leaderboard);
