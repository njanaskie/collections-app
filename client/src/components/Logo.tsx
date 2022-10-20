import { Flex, Heading, Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { IoAlbumsOutline } from "react-icons/io5";
import theme from "../theme";

export const Logo = () => {
  return (
    <NextLink href="/">
      <Link _hover={{ textDecoration: "none" }}>
        <Flex>
          <Icon
            as={IoAlbumsOutline}
            h={[10, 10, 12]}
            w={[10, 10, 12]}
            // size="small"
            opacity="60%"
            style={{ transform: "rotate(270deg)" }}
          />
          <Heading
            color={theme.colors.superLightBlue}
            pos="relative"
            left={[-6, -6, -7]}
            top={["2px", "2px", "4px"]}
            letterSpacing={6}
            size={"lg"}
          >
            collections
          </Heading>
        </Flex>
      </Link>
    </NextLink>
  );
};
