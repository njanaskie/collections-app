import { ChevronLeftIcon, EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/layout";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { IoLogoTwitter } from "react-icons/io";
import { CardStack } from "../../components/CardStack";
import { Layout } from "../../components/Layout";
import { itemLimit } from "../../constants";
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
import NextLink from "next/link";

export const User = ({}) => {
  // TODO: fix browser error: 'Warning: Text content did not match. Server: "Could not find user" Client: "loading..."'
  const [{ data: userData, error: userError, fetching: userFetching }] =
    useGetUserFromUrl();
  const intId = useGetIntId();
  const [variables, setVariables] = useState({
    limit: itemLimit,
    createdPage: 1,
    completedPage: 1,
    startedPage: 1,
    userId: intId,
  });
  const [
    {
      data: createdCollections,
      error: createdError,
      fetching: fetchingCreated,
    },
  ] = useUserCreatedCollectionsQuery({
    // pause: !variables.userId || variables.userId === 0 || isServer(),
    pause: !variables.userId,
    variables: {
      limit: variables.limit,
      page: variables.createdPage,
      userId: variables.userId,
    },
  });
  const [
    {
      data: completedCollections,
      error: completedError,
      fetching: fetchingCompleted,
    },
  ] = useUserCompletedCollectionsQuery({
    pause: !variables.userId,
    variables: {
      limit: variables.limit,
      page: variables.completedPage,
      userId: variables.userId,
    },
  });
  const [
    {
      data: startedCollections,
      error: startedError,
      fetching: fetchingStarted,
    },
  ] = useUserStartedCollectionsQuery({
    pause: !variables.userId,
    variables: {
      limit: variables.limit,
      page: variables.startedPage,
      userId: variables.userId,
    },
  });
  const [{ data: meData }] = useMeQuery({ pause: isServer() });
  const isMe = meData?.me?.id === intId;

  const handleFetchMore = (collectionType: string, nextPage: number) => {
    switch (collectionType) {
      case "userCreatedCollections":
        console.log("next page created", collectionType, nextPage);
        return setVariables({
          ...variables,
          createdPage: nextPage,
        });
      case "userCompletedCollections":
        console.log("next page completed", collectionType, nextPage);
        return setVariables({
          ...variables,
          completedPage: nextPage,
        });
      case "userStartedCollections":
        console.log("next page started", collectionType, nextPage);
        return setVariables({
          ...variables,
          startedPage: nextPage,
        });
      default:
        return null;
    }
  };

  useEffect(() => {
    if (intId) {
      setVariables({
        ...variables,
        createdPage: 1,
        completedPage: 1,
        startedPage: 1,
        userId: intId,
      });
    }
  }, [intId]);

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
        <Box>
          <Flex justify="space-between">
            {userData?.user?.user ? (
              <Heading size="lg" mb={5} color={theme.colors.lightOrange}>
                {userData.user.user.username}
              </Heading>
            ) : null}

            {isMe ? (
              <NextLink
                href={{
                  pathname: "/user/edit/[username]",
                  query: { id: meData?.me?.id },
                }}
                as={`/user/edit/${meData?.me?.username}`}
              >
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Edit User"
                  onClick={() => {}}
                  variant="ghost"
                />
              </NextLink>
            ) : null}
          </Flex>
          <Text as="b" color={"gray.200"}>
            {userData.user.user.bio}
          </Text>
          <HStack mb={5}>
            {userData.user.user.letterboxd_url ? (
              <Link href={userData.user.user.letterboxd_url} isExternal>
                <Flex align="center" p={1}>
                  <Image src="/letterboxd-icon.svg" />
                  <Text as="i" color={"gray.200"} ml={1}>
                    Letterboxd
                  </Text>
                </Flex>
              </Link>
            ) : null}
            {userData.user.user.twitter_url ? (
              <Link href={userData.user.user.twitter_url} isExternal>
                <Flex align="center" p={1}>
                  <IoLogoTwitter />
                  <Text as="i" color={"gray.200"} ml={1}>
                    Twitter
                  </Text>
                </Flex>
              </Link>
            ) : null}
            {userData.user.user.website_url ? (
              <Link href={userData.user.user.website_url} isExternal>
                <Flex align="center" p={1}>
                  <Text as="i" color={"gray.200"} ml={1}>
                    {userData.user.user.website_url}
                  </Text>
                </Flex>
              </Link>
            ) : null}
          </HStack>
        </Box>
        <Tabs isFitted>
          <TabList>
            <Tab>My Collections</Tab>
            <Tab>Completed</Tab>
            <Tab>Started</Tab>
            <Tab>Appeals</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {createdCollections?.userCreatedCollections ? (
                <CardStack
                  data={createdCollections.userCreatedCollections}
                  fetching={fetchingCreated}
                  handleFetchMore={handleFetchMore}
                  page={variables.createdPage}
                  collectionType={"userCreatedCollections"}
                />
              ) : (
                <div>someting went wrong</div>
              )}
            </TabPanel>
            <TabPanel>
              {completedCollections?.userCompletedCollections ? (
                <CardStack
                  data={completedCollections.userCompletedCollections}
                  fetching={fetchingCompleted}
                  handleFetchMore={handleFetchMore}
                  page={variables.completedPage}
                  collectionType={"userCompletedCollections"}
                />
              ) : (
                <div>someting went wrong</div>
              )}
            </TabPanel>
            <TabPanel>
              {startedCollections?.userStartedCollections ? (
                <CardStack
                  data={startedCollections.userStartedCollections}
                  fetching={fetchingStarted}
                  handleFetchMore={handleFetchMore}
                  page={variables.startedPage}
                  collectionType={"userStartedCollections"}
                />
              ) : (
                <div>someting went wrong</div>
              )}
            </TabPanel>
            <TabPanel>
              <p>Appeals!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
