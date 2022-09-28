import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  useCollectionsQuery,
  useMostVotesUsersQuery,
} from "../generated/graphql";
import { Layout } from "../components/Layout";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Stack,
  Text,
  Radio,
  RadioGroup,
  Slide,
  SlideFade,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { CardBottom } from "../components/CardBottom";
import { SelectAutoComplete } from "../components/SelectAutoComplete";
import theme from "../theme";
import { ArrowRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { usePrevious } from "../utils/usePrevious";
import { Card } from "../components/Card";
import { itemLimit } from "../constants";
import { TopUsersMini } from "../components/TopUsersMini";
const handleDragStart = (e: any) => e.preventDefault();

const Index = () => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("new");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [variables, setVariables] = useState({
    limit: itemLimit,
    cursor: null as null | string,
    orderBy: "new" as string,
    modulus: null as null | number,
    page: 1,
  });
  const prevPage = usePrevious(variables.page);
  const [{ data, error, fetching }, executeQuery] = useCollectionsQuery({
    variables,
    // requestPolicy: "network-only",
  });

  useEffect(() => {
    setIsRefreshing(true);
    // console.log("fetch new order", initialVariablesState);
    setVariables({ ...variables, orderBy, page: 1, modulus: null });
    if (swiper && !swiper.destroyed) {
      swiper.slideTo(0);
    }
    // const req = executeQuery({
    //   requestPolicy: "network-only",
    //   //   // variables: { orderBy: "popular" },
    // });
    // console.log("request", req);
    setIsRefreshing(false);
  }, [orderBy]);

  if (!fetching && !data) {
    return (
      <div>
        <div>your query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      <Text
        letterSpacing="tight"
        fontSize="xl"
        color={theme.colors.superLightBlue}
        mb={4}
      >
        Welcome, start guessing films or make your own collection!
      </Text>
      <Divider />
      <Flex justify="flex-start">
        <RadioGroup
          onChange={setOrderBy}
          size="lg"
          value={orderBy}
          marginBlock={4}
          colorScheme={"teal"}
        >
          <Stack color={theme.colors.superLightBlue} direction="row">
            <Radio value="new">New</Radio>
            <Radio value="popular">Popular</Radio>
            <Radio value="random">Random</Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      {!data && fetching ? (
        <Spinner />
      ) : !fetching && data?.collections.collections?.length === 0 ? (
        <Box>Ain't no collections to be found :(</Box>
      ) : (
        <>
          <Box>
            <Swiper
              onReset={() => console.log("on reset")}
              // spaceBetween={20}
              slidesPerView={3}
              // grid={{ rows: 2 }}
              onSlideChange={() => {}}
              onSwiper={setSwiper}
              navigation={{
                prevEl: prevRef.current!, // Assert non-null
                nextEl: nextRef.current!, // Assert non-null
              }}
              modules={[Navigation]}
              onReachEnd={() => {
                console.log("onReachEnd");
                if (!data || !data.collections.hasMore) {
                  console.log("no data");
                  return;
                }

                if (data.collections.modulus) {
                  setVariables({
                    ...variables,
                    modulus: data.collections.modulus,
                    page: prevPage + 1,
                  });
                } else {
                  setVariables({
                    ...variables,
                    page: prevPage + 1,
                  });
                }
              }}
            >
              {data!.collections.collections.map((c) =>
                !c ? null : (
                  <SwiperSlide key={c.id}>
                    {({ isActive }) => <Card c={c} />}
                  </SwiperSlide>
                )
              )}
            </Swiper>
            <Flex justify="center" m={4}>
              <Button
                ref={prevRef}
                m={2}
                size="lg"
                color={theme.colors.darkBlue}
                bgColor={theme.colors.gold}
                _hover={{ bg: theme.colors.darkGold }}
                _active={{ bg: theme.colors.gold }}
              >
                Previous
              </Button>
              <Button
                ref={nextRef}
                m={2}
                size="lg"
                color={theme.colors.darkBlue}
                bgColor={theme.colors.gold}
                _hover={{ bg: theme.colors.darkGold }}
                _active={{ bg: theme.colors.gold }}
              >
                Next
              </Button>
            </Flex>
          </Box>
        </>
      )}
      <NextLink href="/leaderboard">
        <Button
          as={Link}
          bgColor={theme.colors.lightBlue}
          color={theme.colors.darkBlue}
          borderRadius={20}
          mt={20}
          _hover={{ bg: theme.colors.lightOrange, textDecoration: "none" }}
          h={55}
        >
          <Flex align="center" justify="space-between" p={4} w={300}>
            <Heading mr={2}>Top Players</Heading>
            <ArrowRightIcon />
          </Flex>
        </Button>
      </NextLink>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
