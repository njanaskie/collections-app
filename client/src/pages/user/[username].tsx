import { Box, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { BoxContent } from "../../components/user/BoxContent";
import { TabContent } from "../../components/user/TabContent";
import { itemLimit } from "../../constants";
import {
  useAppealsReviewableQuery,
  useAppealsSubmittedQuery,
  useMeQuery,
  useUserCompletedCollectionsQuery,
  useUserCreatedCollectionsQuery,
  useUserStartedCollectionsQuery,
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { isServer } from "../../utils/isServer";
import { useGetIntId } from "../../utils/useGetIntId";
import { useGetUserFromUrl } from "../../utils/useGetUserFromUrl";

export const User = ({}) => {
  // TODO: Warning: Expected server HTML to contain a matching <span> in <div>.
  const [{ data: userData, error: userError, fetching: userFetching }] =
    useGetUserFromUrl();
  const intId = useGetIntId();
  const [{ data: meData }] = useMeQuery({ pause: isServer() });
  const isMe = meData?.me?.id === intId;
  const [appealState, setAppealState] = useState<string>("pending");
  const [variables, setVariables] = useState({
    limit: itemLimit,
    createdPage: 1,
    completedPage: 1,
    startedPage: 1,
    appealsSubmittedPage: 1,
    appealsReviewablePage: 1,
    userId: intId,
  });
  const [createdCollectionsResults] = useUserCreatedCollectionsQuery({
    // pause: !variables.userId || variables.userId === 0 || isServer(),
    pause: !variables.userId || variables.userId === -1,
    variables: {
      limit: variables.limit,
      page: variables.createdPage,
      userId: variables.userId,
    },
  });
  const [completedCollectionsResults] = useUserCompletedCollectionsQuery({
    pause: !variables.userId || variables.userId === -1,
    variables: {
      limit: variables.limit,
      page: variables.completedPage,
      userId: variables.userId,
    },
  });
  const [startedCollectionsResults] = useUserStartedCollectionsQuery({
    pause: !variables.userId || variables.userId === -1,
    variables: {
      limit: variables.limit,
      page: variables.startedPage,
      userId: variables.userId,
    },
  });
  const [appealsSubmittedResults] = useAppealsSubmittedQuery({
    pause: !variables.userId || variables.userId === -1 || !isMe,
    variables: {
      state: appealState,
      limit: variables.limit,
      page: variables.appealsSubmittedPage,
    },
  });
  const [appealsReviewableResults] = useAppealsReviewableQuery({
    pause: !variables.userId || variables.userId === -1 || !isMe,
    variables: {
      limit: variables.limit,
      page: variables.appealsReviewablePage,
    },
  });

  const handleFetchMore = (queryType: string, nextPage: number) => {
    switch (queryType) {
      case "userCreatedCollections":
        return setVariables({
          ...variables,
          createdPage: nextPage,
        });
      case "userCompletedCollections":
        return setVariables({
          ...variables,
          completedPage: nextPage,
        });
      case "userStartedCollections":
        return setVariables({
          ...variables,
          startedPage: nextPage,
        });
      case "appealsSubmitted":
        return setVariables({
          ...variables,
          appealsSubmittedPage: nextPage,
        });
      case "appealsReviewable":
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

  const userStats = {
    created: createdCollectionsResults.data?.userCreatedCollections.totalCount,
    completed:
      completedCollectionsResults.data?.userCompletedCollections.totalCount,
    started: startedCollectionsResults.data?.userStartedCollections.totalCount,
    guesses: userData?.user?.user?.totalCorrectGuesses,
    likes: userData?.user?.user?.totalLikesReceived,
  };

  if (userFetching) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (userError) {
    return (
      <Layout>
        <Box>{userError.message}</Box>
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
      {/* <Box> */}
      <BoxContent
        userData={userData.user.user}
        meData={meData?.me}
        isMe={isMe}
        userStats={userStats}
      />
      <TabContent
        userData={userData.user.user}
        isMe={isMe}
        createdCollectionsResults={createdCollectionsResults}
        completedCollectionsResults={completedCollectionsResults}
        startedCollectionsResults={startedCollectionsResults}
        appealsSubmittedResults={appealsSubmittedResults}
        appealsReviewableResults={appealsReviewableResults}
        handleFetchMore={handleFetchMore}
        variables={variables}
        handleAppealStateChange={handleAppealStateChange}
        appealState={appealState}
      />
      {/* </Box> */}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
