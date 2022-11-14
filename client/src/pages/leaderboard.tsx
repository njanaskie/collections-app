import { Divider, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { BackButton } from "../components/BackButton";
import { Layout } from "../components/Layout";
import { MostCompletedCollectionsUsers } from "../components/tables/MostCompletedCollectionsUsers";
import { MostCreatedCollectionsUsers } from "../components/tables/MostCreatedCollectionsUsers";
import { MostGuessesUsers } from "../components/tables/MostGuessesUsers";
import { MostVotesUsers } from "../components/tables/MostVotesUsers";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const Leaderboard = () => {
  const [option, setOption] = useState<string>("created");
  let body: any = null;

  switch (option) {
    case "votes":
      body = <MostVotesUsers />;
      break;
    case "guesses":
      body = <MostGuessesUsers />;
      break;
    case "created":
      body = <MostCreatedCollectionsUsers />;
      break;
    case "completed":
      body = <MostCompletedCollectionsUsers />;
      break;
  }

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
      <Select
        w={"40%"}
        // placeholder="Select a stat"
        onChange={(e) => setOption(e.target.value)}
        mb={10}
        bgColor="blackAlpha.300"
      >
        <option value="created">Created</option>
        <option value="completed">Completed</option>
        <option value="votes">Likes</option>
        <option value="guesses">Guesses</option>
      </Select>
      <Flex justify="space-evenly" wrap="wrap" overflow="scroll">
        {body}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Leaderboard);
