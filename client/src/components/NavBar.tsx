import { Box, Button, Link, Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import theme from "../theme";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [mount, setMount] = useState(false);
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: mount,
  });
  let body = null;

  useEffect(() => {
    setMount(true);
  }, []);

  // data is loading
  if (fetching) {
    //user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white"> Register</Link>
        </NextLink>
      </>
    );

    //user is logged in
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-collection">
          <Button as={Link} mr={4} color="gray.200" variant="ghost">
            Create Collection
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" bg="blackAlpha.700" p={4} align="center">
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading color="gray.200">Collections</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"} color="gray.200">
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
