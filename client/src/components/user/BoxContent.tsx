import { EditIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/layout";
import { Flex, IconButton, Image, Link, Stack, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IoLogoTwitter } from "react-icons/io";
import { User } from "../../generated/graphql";
import theme from "../../theme";
import { UserStatsBox } from "./UserStatsBox";

export type UserStatsProps = {
  created?: number;
  completed?: number;
  started?: number;
  guesses?: number;
  likes?: number;
};

interface BoxContentProps {
  userData: User;
  meData: User | undefined | null;
  isMe: boolean;
  userStats: UserStatsProps;
}

export const BoxContent: React.FC<BoxContentProps> = ({
  userData,
  meData,
  isMe,
  userStats,
}) => {
  return (
    <Box>
      <Flex justify="space-between">
        <Box w="50%">
          <Flex>
            {userData ? (
              <Heading size="lg" mb={2} mr={2} color={theme.colors.lightOrange}>
                {userData.username}
              </Heading>
            ) : null}

            {isMe && meData ? (
              <NextLink
                href={{
                  pathname: "/user/edit/[username]",
                  query: { id: meData.id },
                }}
                as={`/user/edit/${meData.username}`}
              >
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Edit User"
                  onClick={() => {}}
                  variant="ghost"
                  color={"gray.200"}
                  _hover={{ textDecor: "none" }}
                />
              </NextLink>
            ) : null}
          </Flex>
          <Stack
            direction={["column", "row"]}
            // spacing="-px"
            mb={1}
            wrap="wrap"
            overflow="auto"
          >
            {userData.letterboxd_url ? (
              <Link
                href={userData.letterboxd_url}
                isExternal
                _hover={{ textDecoration: "none" }}
              >
                <Flex align="center" pr={1}>
                  <Image src="/letterboxd-icon.svg" />
                  <Text
                    as="i"
                    color={"gray.200"}
                    ml={1}
                    _hover={{ textColor: "white" }}
                    fontSize="sm"
                  >
                    Letterboxd
                  </Text>
                </Flex>
              </Link>
            ) : null}
            {userData.twitter_url ? (
              <Link
                href={userData.twitter_url}
                isExternal
                _hover={{ textDecor: "none" }}
              >
                <Flex align="center" pr={1}>
                  <IoLogoTwitter color="lightBlue" />
                  <Text
                    as="i"
                    color={"gray.200"}
                    ml={1}
                    _hover={{ textColor: "white" }}
                    fontSize="sm"
                  >
                    Twitter
                  </Text>
                </Flex>
              </Link>
            ) : null}
            {userData.website_url ? (
              <Link
                href={userData.website_url}
                isExternal
                _hover={{ textDecor: "none" }}
              >
                <Flex align="center" pr={1}>
                  <Text
                    as="i"
                    color={"gray.200"}
                    ml={1}
                    _hover={{ textColor: "white" }}
                    fontSize="sm"
                    noOfLines={1}
                  >
                    {userData.website_url}
                  </Text>
                </Flex>
              </Link>
            ) : null}
          </Stack>
          <Text as="b" color={"gray.300"} noOfLines={8} overflow="scroll">
            {userData.bio}
          </Text>
        </Box>
        <Box ml={2} maxW={450}>
          <UserStatsBox userStats={userStats} username={userData.username} />
        </Box>
      </Flex>
    </Box>
  );
};
