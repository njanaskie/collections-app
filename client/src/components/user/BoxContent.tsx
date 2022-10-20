import { EditIcon } from "@chakra-ui/icons";
import { Box, Heading } from "@chakra-ui/layout";
import { Flex, HStack, IconButton, Image, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IoLogoTwitter } from "react-icons/io";
import { User } from "../../generated/graphql";
import theme from "../../theme";

interface BoxContentProps {
  userData: User;
  meData: User | undefined | null;
  isMe: boolean;
}

export const BoxContent: React.FC<BoxContentProps> = ({
  userData,
  meData,
  isMe,
}) => {
  return (
    <Box>
      <Flex justify="space-between">
        {userData ? (
          <Heading size="lg" mb={2} color={theme.colors.lightOrange}>
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
      <Text as="b" color={"gray.300"}>
        {userData.bio}
      </Text>
      <HStack mb={5} wrap="wrap" overflow="auto">
        {userData.letterboxd_url ? (
          <Link
            href={userData.letterboxd_url}
            isExternal
            _hover={{ textDecoration: "none" }}
          >
            <Flex align="center" p={1}>
              <Image src="/letterboxd-icon.svg" />
              <Text
                as="i"
                color={"gray.200"}
                ml={1}
                _hover={{ textColor: "white" }}
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
            <Flex align="center" p={1}>
              <IoLogoTwitter color="lightBlue" />
              <Text
                as="i"
                color={"gray.200"}
                ml={1}
                _hover={{ textColor: "white" }}
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
            <Flex align="center" p={1}>
              <Text
                as="i"
                color={"gray.200"}
                ml={1}
                _hover={{ textColor: "white" }}
              >
                {userData.website_url}
              </Text>
            </Flex>
          </Link>
        ) : null}
      </HStack>
    </Box>
  );
};
