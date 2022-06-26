import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useCollectionsQuery } from "../generated/graphql";
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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { CardBottom } from "../components/CardBottom";
import { SelectAutoComplete } from "../components/SelectAutoComplete";
import theme from "../theme";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { usePrevious } from "../utils/usePrevious";
import { Card } from "../components/Card";
const handleDragStart = (e: any) => e.preventDefault();

const Index = () => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [orderBy, setOrderBy] = useState<string>("new");
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [variables, setVariables] = useState({
    limit: 4,
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
      <Flex justify="flex-start">
        <RadioGroup
          onChange={setOrderBy}
          size="lg"
          value={orderBy}
          marginBlock={4}
          colorScheme="messenger"
        >
          <Stack direction="row">
            <Radio value="new">New</Radio>
            <Radio value="popular">Popular</Radio>
            <Radio value="random">Random</Radio>
          </Stack>
        </RadioGroup>
      </Flex>
      {!data && fetching ? (
        <div>loading...</div>
      ) : !fetching && data?.collections.collections?.length === 0 ? (
        <Box>Ain't no collections to be found :(</Box>
      ) : (
        <>
          <Box>
            <Swiper
              onReset={() => console.log("on reset")}
              spaceBetween={20}
              slidesPerView={3}
              onSlideChange={() => {}}
              onSwiper={setSwiper}
              navigation={{
                prevEl: prevRef.current!, // Assert non-null
                nextEl: nextRef.current!, // Assert non-null
              }}
              modules={[Navigation]}
              onReachEnd={() => {
                console.log("onReachEnd");
                if (!data) {
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

                // setVariables({
                //   limit: variables.limit,
                //   cursor: data.collections.collections
                //     ? data.collections.collections[
                //         data.collections.collections.length - 1
                //       ]?.createdAt
                //     : null,
                //   orderBy,
                //   modulus: data.collections.modulus,
                //   page: variables.page
                // });
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
              >
                Previous
              </Button>
              <Button
                ref={nextRef}
                m={2}
                size="lg"
                color={theme.colors.darkBlue}
              >
                Next
              </Button>
            </Flex>
          </Box>
        </>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
