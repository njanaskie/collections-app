import {
  Box,
  Button,
  Link,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import theme from "../theme";
import { isServer } from "../utils/isServer";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { query } from "@urql/exchange-graphcache";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [mount, setMount] = useState(false);
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // pause: mount,
    pause: isServer(), //this line of code stops the me query running from NextJs server as the session is not present on server.
  });
  let body = null;

  // useEffect(() => {
  //   // if (mount === undefined) {
  //   setMount(true);
  //   // }
  // }, []);

  // data is loading
  if (fetching && isServer()) {
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
          <Button
            as={Link}
            mr={4}
            bgColor={theme.colors.green}
            _hover={{ bg: theme.colors.darkGreen, textDecoration: "none" }}
            variant="solid"
            leftIcon={<AddIcon />}
            textDecor="none"
          >
            Add Collection
          </Button>
        </NextLink>
        <Flex>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
            >
              {data.me.username}
            </MenuButton>
            <MenuList zIndex="dropdown">
              <NextLink
                href={{
                  pathname: "/user/[username]",
                  query: { id: data.me.id },
                }}
                as={`/user/${data.me.username}`}
              >
                <MenuItem as={Link} _hover={{ textDecoration: "none" }}>
                  Profile
                </MenuItem>
              </NextLink>
              <MenuItem>Support!</MenuItem>
              <MenuItem
                as={Button}
                onClick={async () => {
                  await logout();
                  router.reload();
                }}
                isLoading={logoutFetching}
                variant="link"
                _hover={{ textDecoration: "none" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} bg="blackAlpha.700" p={4} align="center">
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
