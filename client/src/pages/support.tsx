import { Box, Divider, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { BackButton } from "../components/BackButton";
import { Layout } from "../components/Layout";
import { MostGuessesUsers } from "../components/tables/MostGuessesUsers";
import { MostVotesUsers } from "../components/tables/MostVotesUsers";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

const Support = () => {
  return (
    <Layout>
      <Flex
        align="center"
        color={theme.colors.superLightBlue}
        mt={15}
        bg="blackAlpha.600"
        p={10}
        borderRadius={20}
        shadow="md"
      >
        <Box>
          <Text>
            You can support this site by sending any feature ideas or bugs to{" "}
            <Link
              href="mailto:thecollectionsgame@gmail.com"
              color={theme.colors.gold}
            >
              thecollectionsgame@gmail.com
            </Link>
            .
          </Text>
          <Text mt={10}>Thank you for playing!</Text>
        </Box>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Support);
