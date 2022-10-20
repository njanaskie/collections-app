import { HamburgerIcon } from "@chakra-ui/icons";
import { Divider } from "@chakra-ui/layout";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppealItem } from "../../components/AppealItem";
import { Card } from "../card/Card";
import { ItemStack } from "../../components/ItemStack";
import { itemLimit } from "../../constants";
import {
  useAppealsReviewableQuery,
  useAppealsSubmittedQuery,
  User,
  useUserCompletedCollectionsQuery,
  useUserCreatedCollectionsQuery,
  useUserStartedCollectionsQuery,
} from "../../generated/graphql";
import theme from "../../theme";
import { useGetIntId } from "../../utils/useGetIntId";
import { useIsMobile } from "../../utils/useIsMobile";
import { AppealsReviewableItem } from "../appealItem/AppealsReviewableItem";
import { AppealsSubmittedItem } from "../appealItem/AppealsSubmittedItem";
import { TabHeadings } from "./TabHeadings";

interface TabContentProps {
  userData: User;
  isMe: boolean;
}

export const TabContent: React.FC<TabContentProps> = ({ userData, isMe }) => {
  const [appealState, setAppealState] = useState<string>("pending");
  const intId = useGetIntId();
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

  const handleAppealStateChange = (e: string) => {
    setAppealState(e);
    setVariables({
      ...variables,
      appealsSubmittedPage: 1,
    });
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

  return (
    <Tabs variant="soft-rounded" isFitted>
      <TabHeadings username={userData.username} isMe={isMe} />
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
              item={(i: any) => (
                <Flex p={2} key={i.id}>
                  <Card c={i} size="small" />
                </Flex>
              )}
            />
          ) : createdError ? (
            <div>{createdError.message}</div>
          ) : (
            <Text color="gray.200">Nothing here...</Text>
          )}
        </TabPanel>
        <TabPanel>
          {completedCollections?.userCompletedCollections ? (
            <ItemStack
              data={completedCollections.userCompletedCollections.collections}
              hasMore={completedCollections.userCompletedCollections.hasMore}
              fetching={fetchingCompleted}
              handleFetchMore={handleFetchMore}
              page={variables.completedPage}
              queryType={"userCompletedCollections"}
              item={(i: any) => (
                <Flex p={2} key={i.id}>
                  <Card c={i} size="small" />
                </Flex>
              )}
            />
          ) : completedError ? (
            <div>{completedError.message}</div>
          ) : (
            <Text color="gray.200">Nothing here...</Text>
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
              item={(i: any) => (
                <Flex p={2} key={i.id}>
                  <Card c={i} size="small" />
                </Flex>
              )}
            />
          ) : startedError ? (
            <div>{startedError.message}</div>
          ) : (
            <Text color="gray.200">Nothing here...</Text>
          )}
        </TabPanel>
        <TabPanel>
          <Tabs variant="soft-rounded">
            <TabList>
              <Tooltip
                label="Appeals that others have submitted"
                fontSize="sm"
                placement="auto"
              >
                <Tab color={theme.colors.superLightBlue}>
                  {appealsReviewable?.appealsReviewable.appeals &&
                  appealsReviewable?.appealsReviewable.appeals.length > 0 ? (
                    <Text
                      color="white"
                      bgColor={theme.colors.rose}
                      rounded="full"
                      w={6}
                      h={6}
                      mr={1}
                    >
                      {appealsReviewable?.appealsReviewable.appeals.length}
                    </Text>
                  ) : null}
                  Appeals To Review
                </Tab>
              </Tooltip>
              <Tooltip
                label="Appeals that I have submitted"
                fontSize="sm"
                placement="auto"
              >
                <Tab color={theme.colors.superLightBlue}> My Appeals</Tab>
              </Tooltip>
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
                      <Flex p={2} key={`${i.collectionId}-${i.externalId}`}>
                        <AppealsReviewableItem appeal={i} />
                      </Flex>
                    )}
                  />
                ) : appealsReviewableError ? (
                  <div>{appealsReviewableError.message}</div>
                ) : (
                  <Text color="gray.200">Nothing here...</Text>
                )}
              </TabPanel>
              <TabPanel>
                <Divider />
                <Flex justify="flex-start">
                  <RadioGroup
                    onChange={handleAppealStateChange}
                    size="lg"
                    value={appealState}
                    marginBlock={4}
                    color={"gray.200"}
                    // colorScheme={"teal"}
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
                    // item={(i: any) => (
                    //   <AppealItem appeal={i} mode="submitted" />
                    // )}
                    item={(i: any) => (
                      <Flex p={2} key={i.id}>
                        <AppealsSubmittedItem appeal={i} />
                      </Flex>
                    )}
                  />
                ) : appealsSubmittedError ? (
                  <div>{appealsSubmittedError.message}</div>
                ) : (
                  <Text color="gray.200">Nothing here...</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
