import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/layout";
import {
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { IoLogoTwitter } from "react-icons/io";
import { CardStack } from "../../components/CardStack";
import { Layout } from "../../components/Layout";
import {
  useMeQuery,
  useUserCompletedCollectionsQuery,
  useUserCreatedCollectionsQuery,
  useUserQuery,
  useUserStartedCollectionsQuery,
} from "../../generated/graphql";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { isServer } from "../../utils/isServer";
import { useGetIntId } from "../../utils/useGetIntId";
import { useGetUserFromUrl } from "../../utils/useGetUserFromUrl";

export const User = ({}) => {
  // TODO: fix browser error: 'Warning: Text content did not match. Server: "Could not find user" Client: "loading..."'
  const [{ data: userData, error: userError, fetching: userFetching }] =
    useGetUserFromUrl();
  const intId = useGetIntId();
  const [variables, setVariables] = useState({
    limit: 4,
    page: 1,
    userId: intId,
  });
  const [
    {
      data: createdCollections,
      error: createdError,
      fetching: createdFetching,
    },
  ] = useUserCreatedCollectionsQuery({
    pause: !variables.userId || variables.userId === 0 || isServer(),
    variables,
  });
  const [
    {
      data: completedCollections,
      error: completedError,
      fetching: completedFetching,
    },
  ] = useUserCompletedCollectionsQuery({
    pause: !variables.userId || variables.userId === 0 || isServer(),
    variables,
  });
  const [
    {
      data: startedCollections,
      error: startedError,
      fetching: startedFetching,
    },
  ] = useUserStartedCollectionsQuery({
    pause: !variables.userId || variables.userId === 0 || isServer(),
    variables,
  });

  useEffect(() => {
    if (intId) {
      console.log("ueffect", userData?.user?.user);
      setVariables({ ...variables, userId: intId });
    }
  }, [intId]);

  console.log(
    "createdCollections",
    createdCollections,
    variables,
    userData,
    intId
  );

  if (userFetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout>
        <div>{userError.message}</div>
      </Layout>
    );
  }

  if (!userData?.user?.user) {
    return (
      <Layout>
        <Box>Could not find user</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Flex justify="center">
          {userData?.user?.user ? (
            <Heading size="lg" mb={5} color={theme.colors.lightBlue}>
              {userData.user.user.username}
            </Heading>
          ) : null}
        </Flex>
        <Flex justify="center">
          <HStack mb={5}>
            <Link href="https://letterboxd.com" isExternal>
              <ExternalLinkIcon mx="2px" /> Letterboxd
            </Link>
            <Link href="https://twitter.com" isExternal>
              <Flex align="center" p={1}>
                <IoLogoTwitter />
                Twitter
              </Flex>
            </Link>
          </HStack>
        </Flex>

        <Flex justify="center">
          <Tabs>
            <TabList>
              <Tab>My Collections</Tab>
              <Tab>Completed</Tab>
              <Tab>Started</Tab>
              <Tab>Appeals</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {createdCollections?.userCreatedCollections ? (
                  <CardStack data={createdCollections.userCreatedCollections} />
                ) : (
                  <p>loading created colls</p>
                )}
              </TabPanel>
              <TabPanel>
                {completedCollections?.userCompletedCollections ? (
                  <CardStack
                    data={completedCollections.userCompletedCollections}
                  />
                ) : (
                  <p>loading completed colls</p>
                )}
              </TabPanel>
              <TabPanel>
                {startedCollections?.userStartedCollections ? (
                  <CardStack data={startedCollections.userStartedCollections} />
                ) : (
                  <p>loading started colls</p>
                )}
              </TabPanel>
              <TabPanel>
                <p>Appeals!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
