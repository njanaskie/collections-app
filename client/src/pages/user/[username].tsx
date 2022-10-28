import { Box, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { BoxContent } from "../../components/user/BoxContent";
import { TabContent } from "../../components/user/TabContent";
import { useMeQuery } from "../../generated/graphql";
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
      />
      <TabContent userData={userData.user.user} isMe={isMe} />
      {/* </Box> */}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(User);
