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
  Radio,
  RadioGroup,
  Stack,
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
import { ItemStack } from "../../components/ItemStack";
import { Layout } from "../../components/Layout";
import { itemLimit } from "../../constants";
import {
  useMeQuery,
  useAppealsSubmittedQuery,
  useUserCompletedCollectionsQuery,
  useUserCreatedCollectionsQuery,
  useUserQuery,
  useUserStartedCollectionsQuery,
  useAppealsReviewableQuery,
  UserPaginatedCollectionsFragment,
  Appeal,
} from "../../generated/graphql";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { isServer } from "../../utils/isServer";
import { useGetIntId } from "../../utils/useGetIntId";
import { useGetUserFromUrl } from "../../utils/useGetUserFromUrl";
import NextLink from "next/link";
import { SelectedEntriesList } from "../../components/SelectedEntriesList";
import { Card } from "../../components/Card";
import { AppealItem } from "../../components/AppealItem";

export const User = ({}) => {
  const [appealState, setAppealState] = useState<string>("pending");
  const intId = useGetIntId();
  const [{ data: meData }] = useMeQuery({ pause: isServer() });
  const isMe = meData?.me?.id === intId;
  // TODO: fix browser error: 'Warning: Text content did not match. Server: "Could not find user" Client: "loading..."'
  const [{ data: userData, error: userError, fetching: userFetching }] =
    useGetUserFromUrl();
  const [variables, setVariables] = useState({
    limit: itemLimit,
    createdPage: 1,
    completedPage: 1,
    startedPage: 1,
    appealsSubmittedPage: 1,
    appealsReviewablePage: 1,
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
    pause: !variables.userId || variables.userId === -1,
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
    pause: !variables.userId || variables.userId === -1 || !isMe,
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
    pause: !variables.userId || variables.userId === -1 || !isMe,
    variables: {
      limit: variables.limit,
      page: variables.startedPage,
      userId: variables.userId,
    },
  });
  const [
    {
      data: appealsSubmitted,
      error: appealsSubmittedError,
      fetching: fetchingAppealsSubmitted,
    },
  ] = useAppealsSubmittedQuery({
    pause: !variables.userId || variables.userId === -1 || !isMe,
    variables: {
      state: appealState,
      limit: variables.limit,
      page: variables.appealsSubmittedPage,
    },
  });
  const [
    {
      data: appealsReviewable,
      error: appealsReviewableError,
      fetching: fetchingAppealsReviewable,
    },
  ] = useAppealsReviewableQuery({
    pause: !variables.userId || variables.userId === -1 || !isMe,
    variables: {
      limit: variables.limit,
      page: variables.appealsReviewablePage,
    },
  });

  const handleFetchMore = (queryType: string, nextPage: number) => {
    switch (queryType) {
      case "userCreatedCollections":
        console.log("next page created", queryType, nextPage);
        return setVariables({
          ...variables,
          createdPage: nextPage,
        });
      case "userCompletedCollections":
        console.log("next page completed", queryType, nextPage);
        return setVariables({
          ...variables,
          completedPage: nextPage,
        });
      case "userStartedCollections":
        console.log("next page started", queryType, nextPage);
        return setVariables({
          ...variables,
          startedPage: nextPage,
        });
      case "appealsSubmitted":
        console.log("next page appealsSubmitted", queryType, nextPage);
        return setVariables({
          ...variables,
          appealsSubmittedPage: nextPage,
        });
      case "appealsReviewable":
        console.log("next page appealsReviewable", queryType, nextPage);
        return setVariables({
          ...variables,
          appealsReviewablePage: nextPage,
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
        appealsSubmittedPage: 1,
        appealsReviewablePage: 1,
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
            <Tab>Collections</Tab>
            {isMe ? (
              <>
                <Tab>Completed</Tab>
                <Tab>Started</Tab>
                <Tab>Appeals</Tab>
              </>
            ) : null}
          </TabList>

          <TabPanels>
            <TabPanel>
              {createdCollections?.userCreatedCollections ? (
                <ItemStack
                  data={createdCollections.userCreatedCollections.collections}
                  hasMore={createdCollections.userCreatedCollections.hasMore}
                  fetching={fetchingCreated}
                  handleFetchMore={handleFetchMore}
                  page={variables.createdPage}
                  queryType={"userCreatedCollections"}
                  item={(i: any) => <Card c={i} size="small" />}
                />
              ) : (
                <div>Nothing here</div>
              )}
            </TabPanel>
            <TabPanel>
              {completedCollections?.userCompletedCollections ? (
                <ItemStack
                  data={
                    completedCollections.userCompletedCollections.collections
                  }
                  hasMore={
                    completedCollections.userCompletedCollections.hasMore
                  }
                  fetching={fetchingCompleted}
                  handleFetchMore={handleFetchMore}
                  page={variables.completedPage}
                  queryType={"userCompletedCollections"}
                  item={(i: any) => <Card c={i} size="small" />}
                />
              ) : (
                <div>Nothing here</div>
              )}
            </TabPanel>
            <TabPanel>
              {startedCollections?.userStartedCollections ? (
                <ItemStack
                  data={startedCollections.userStartedCollections.collections}
                  hasMore={startedCollections.userStartedCollections.hasMore}
                  fetching={fetchingStarted}
                  handleFetchMore={handleFetchMore}
                  page={variables.startedPage}
                  queryType={"userStartedCollections"}
                  item={(i: any) => <Card c={i} size="small" />}
                />
              ) : (
                <div>Nothing here</div>
              )}
            </TabPanel>
            <TabPanel>
              <Tabs>
                <TabList>
                  <Tab>Appeals To Review</Tab>
                  <Tab>My Appeals</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {appealsReviewable?.appealsReviewable ? (
                      <ItemStack
                        data={appealsReviewable?.appealsReviewable.appeals}
                        hasMore={appealsReviewable?.appealsReviewable.hasMore}
                        fetching={fetchingAppealsReviewable}
                        handleFetchMore={handleFetchMore}
                        page={variables.appealsReviewablePage}
                        queryType={"appealsReviewable"}
                        item={(i: any) => (
                          <AppealItem appeal={i} mode="reviewable" />
                        )}
                      />
                    ) : (
                      <div>Nothing here</div>
                    )}
                  </TabPanel>
                  <TabPanel>
                    <Flex justify="flex-start">
                      <RadioGroup
                        onChange={setAppealState}
                        size="lg"
                        value={appealState}
                        marginBlock={4}
                        colorScheme="messenger"
                      >
                        <Stack direction="row">
                          <Radio value="pending">Pending</Radio>
                          <Radio value="approved">Approved</Radio>
                          <Radio value="rejected">Rejected</Radio>
                        </Stack>
                      </RadioGroup>
                    </Flex>
                    {appealsSubmitted?.appealsSubmitted ? (
                      <ItemStack
                        data={appealsSubmitted?.appealsSubmitted.appeals}
                        hasMore={appealsSubmitted?.appealsSubmitted.hasMore}
                        fetching={fetchingAppealsSubmitted}
                        handleFetchMore={handleFetchMore}
                        page={variables.appealsSubmittedPage}
                        queryType={"appealsSubmitted"}
                        item={(i: any) => (
                          <AppealItem appeal={i} mode="submitted" />
                        )}
                      />
                    ) : (
                      <div>Nothing here</div>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
