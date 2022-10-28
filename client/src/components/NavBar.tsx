import { AddIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import theme from "../theme";
import { isServer } from "../utils/isServer";
import { useIsMobile } from "../utils/useIsMobile";
import { Logo } from "./Logo";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [mount, setMount] = useState(false);
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // pause: mount,
    pause: isServer(), //this line of code stops the me query running from NextJs server as the session is not present on server.
  });
  const mobile = useIsMobile();

  let body = null;

  const DropDownItems = () => (
    <MenuList
      zIndex="dropdown"
      bgColor={"gray.200"}
      color={theme.colors.darkBlue}
    >
      {mobile ? (
        <NextLink href="/create-collection">
          <MenuItem as={Link} _hover={{ textDecoration: "none" }}>
            Add Collection
          </MenuItem>
        </NextLink>
      ) : null}
      <NextLink
        href={{
          pathname: "/user/[username]",
          query: { id: data?.me?.id },
        }}
        as={`/user/${data?.me?.username}`}
      >
        <MenuItem as={Link} _hover={{ textDecoration: "none" }}>
          Profile
        </MenuItem>
      </NextLink>
      {/* <MenuItem>Support!</MenuItem> */}
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
  );

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
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );

    //user is logged in
  } else {
    body = (
      <Flex align="center">
        {mobile ? (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              bgColor={theme.colors.lightPurple}
              color={"gray.200"}
              icon={<HamburgerIcon />}
              variant="unstyled"
            />
            <DropDownItems />
          </Menu>
        ) : (
          <>
            {mobile ? null : (
              <NextLink href="/create-collection">
                <Button
                  as={Link}
                  bgColor={"teal"}
                  _hover={{ bg: "#319795", textDecoration: "none" }}
                  variant="ghost"
                  leftIcon={<AddIcon />}
                  textDecor="none"
                >
                  Add Collection
                </Button>
              </NextLink>
            )}
            <Flex>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                  _hover={{ bgColor: "gray.900" }}
                  _active={{ bg: "gray.900" }}
                >
                  {data.me.username}
                </MenuButton>
                <DropDownItems />
              </Menu>
            </Flex>
          </>
        )}
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} bg="blackAlpha.700" p={4} align="center">
      <Flex flex={1} m="auto" align="center" maxW={850}>
        <Logo />
        <Box ml={"auto"} color="gray.200">
          {body}
        </Box>
      </Flex>
    </Flex>
  );
};
