import { Divider } from "@chakra-ui/layout";
import {
  Flex,
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
import { ItemStack } from "../../components/ItemStack";
import { User } from "../../generated/graphql";
import theme from "../../theme";
import { AppealsReviewableItem } from "../appealItem/AppealsReviewableItem";
import { AppealsSubmittedItem } from "../appealItem/AppealsSubmittedItem";
import { Card } from "../card/Card";
import { TabHeadings } from "./TabHeadings";

type UserCollectionsProps = {
  data?: any;
  error?: any;
  fetching: boolean;
};

interface TabContentProps {
  userData: User;
  isMe: boolean;
  createdCollectionsResults: UserCollectionsProps;
  completedCollectionsResults: UserCollectionsProps;
  startedCollectionsResults: UserCollectionsProps;
  appealsSubmittedResults: UserCollectionsProps;
  appealsReviewableResults: UserCollectionsProps;
  handleFetchMore: any;
  variables: any;
  handleAppealStateChange: any;
  appealState: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  userData,
  isMe,
  createdCollectionsResults,
  completedCollectionsResults,
  startedCollectionsResults,
  appealsSubmittedResults,
  appealsReviewableResults,
  handleFetchMore,
  variables,
  handleAppealStateChange,
  appealState,
}) => {
  const {
    data: createdCollections,
    error: createdError,
    fetching: fetchingCreated,
  } = createdCollectionsResults;
  const {
    data: completedCollections,
    error: completedError,
    fetching: fetchingCompleted,
  } = completedCollectionsResults;
  const {
    data: startedCollections,
    error: startedError,
    fetching: fetchingStarted,
  } = startedCollectionsResults;
  const {
    data: appealsSubmitted,
    error: appealsSubmittedError,
    fetching: fetchingAppealsSubmitted,
  } = appealsSubmittedResults;
  const {
    data: appealsReviewable,
    error: appealsReviewableError,
    fetching: fetchingAppealsReviewable,
  } = appealsReviewableResults;
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
                label="Appeals that others have submitted on my collections"
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
