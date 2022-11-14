import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useEffect, useRef, useState } from "react";
import "react-alice-carousel/lib/alice-carousel.css";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Card } from "../components/card/Card";
import { Layout } from "../components/Layout";
import { itemLimit } from "../constants";
import { useCollectionsQuery } from "../generated/graphql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsMobile } from "../utils/useIsMobile";
import { usePrevious } from "../utils/usePrevious";

const Index = () => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("new");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [variables, setVariables] = useState({
    limit: itemLimit,
    orderBy: "new" as string,
    modulus: null as null | number,
    page: 1,
  });
  const prevPage = usePrevious(variables.page);
  const [{ data, error, fetching }, executeQuery] = useCollectionsQuery({
    variables,
    // requestPolicy: "network-only",
  });
  const mobile = useIsMobile();

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

  let body = null;
  // data is loading
  if (!data && fetching) {
    body = <Spinner />;
  } else if (!fetching && data?.collections.collections?.length === 0) {
    body = <Box>Ain't no collections to be found :(</Box>;
  } else {
    body = (
      <>
        <Box>
          <Swiper
            breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                // spaceBetween: 20,
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 2,
                // spaceBetween: 30,
              },
              // when window width is >= 640px
              640: {
                slidesPerView: 3,
                // spaceBetween: 40,
              },
            }}
            onReset={() => console.log("on reset")}
            spaceBetween={4}
            slidesPerView={1}
            // centeredSlides={
            //   // windowSize.width && windowSize.width < 640 ? true : false
            //   true
            // }
            // centeredSlidesBounds={true}
            // centerInsufficientSlides={true}
            onSlideChange={() => {}}
            onSwiper={setSwiper}
            navigation={{
              prevEl: prevRef.current!, // Assert non-null
              nextEl: nextRef.current!, // Assert non-null
            }}
            modules={[Navigation]}
            onReachEnd={() => {
              if (!data || !data.collections.hasMore) {
                // console.log("no data");
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
                <SwiperSlide key={c.id}>{() => <Card c={c} />}</SwiperSlide>
              )
            )}
          </Swiper>
        </Box>
      </>
    );
  }

  return (
    <Layout>
      {!mobile && (
        <>
          <Text
            letterSpacing="tight"
            fontSize="xl"
            color={theme.colors.superLightBlue}
            mb={1}
          >
            Welcome! Put your film knowledge to the test by guessing films or
            creating your own collection!
          </Text>
          <Divider />
        </>
      )}
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
      {body}
      <Flex justify="center" m={4}>
        <Button
          ref={prevRef}
          isDisabled={!fetching && data?.collections.collections?.length === 0}
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
          isDisabled={!fetching && data?.collections.collections?.length === 0}
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
      <Flex justify={mobile ? "center" : "flex-start"}>
        <NextLink href="/leaderboard">
          <Button
            as={Link}
            bgColor={"whiteAlpha.400"}
            color={theme.colors.darkBlue}
            borderRadius={10}
            // mt={10}
            _hover={{ bg: theme.colors.lightOrange, textDecoration: "none" }}
            h={55}
            pos="fixed"
            bottom={5}
            width={mobile ? "90%" : "auto"}
            // flexGrow={1}
            // variant="ghost"
          >
            <Heading py={4} size={mobile ? "md" : "lg"}>
              Top Players
            </Heading>
          </Button>
        </NextLink>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
