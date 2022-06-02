import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useCollectionsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { CardBottom } from "../components/CardBottom";
import { SelectAutoComplete } from "../components/SelectAutoComplete";
import theme from "../theme";
const handleDragStart = (e: any) => e.preventDefault();

const Index = () => {
  const swiper = useSwiper();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });
  const [{ data, error, fetching }] = useCollectionsQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>your query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  // console.log("collections, ", data?.collections.collections);

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <>
          {/* <Box mb={10}>
            <SelectAutoComplete />
          </Box> */}
          <Box>
            <Swiper
              spaceBetween={20}
              slidesPerView={3}
              onSlideChange={() => {}}
              // onSwiper={() => {}}
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
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.collections.collections[
                      data.collections.collections.length - 1
                    ].createdAt,
                });
              }}
            >
              {data!.collections.collections.map((c) =>
                !c ? null : (
                  <SwiperSlide key={c.id}>
                    <Flex
                      direction="column"
                      p={5}
                      shadow="md"
                      borderWidth="1px"
                      borderColor="gray.200"
                      h={300}
                      justifyContent="space-between"
                      backgroundColor="gray.200"
                      borderRadius={4}
                    >
                      <Box>
                        <NextLink
                          href="/collection/[id]"
                          as={`/collection/${c.id}`}
                        >
                          <Link>
                            <Heading
                              fontSize="lg"
                              color={theme.colors.darkBlue}
                            >
                              {c.titleSnippet}
                            </Heading>
                          </Link>
                        </NextLink>
                      </Box>
                      <CardBottom collection={c} />
                    </Flex>
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

          {/* <AliceCarousel
            mouseTracking
            infinite={false}
            ssrSilentMode={false}
            responsive={{
              0: {
                items: 1,
              },
              1024: {
                items: 3,
              },
            }}
            items={data!.collections.collections.map((c) => (
              <Box
                key={c.id}
                p={5}
                shadow="md"
                borderWidth="1px"
                h={200}
                onDragStart={handleDragStart}
              >
                <Heading fontSize="md">{c.titleSnippet}</Heading>
              </Box>
            ))}
          />
          {data && data.collections.hasMore ? (
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.collections.collections[
                      data.collections.collections.length - 1
                    ].createdAt,
                });
              }}
            >
              Load more
            </Button>
          ) : null} */}
        </>
      )}
    </Layout>
  );

  // return (
  //   <Layout>
  //     {!data && fetching ? (
  //       <div>loading...</div>
  //     ) : (
  //       <Stack spacing={8}>
  //         {data!.collections.collections.map((p) =>
  //           !p ? null : (
  //             <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
  //               <Box flex={1}>
  //                 <Flex align="center">
  //                   <Heading>{p.titleSnippet}</Heading>
  //                 </Flex>
  //               </Box>
  //             </Flex>
  //           )
  //         )}
  //       </Stack>
  //     )}
  //     {data && data.collections.hasMore ? (
  //       <Flex>
  //         <Button
  //           onClick={() => {
  //             setVariables({
  //               limit: variables.limit,
  //               cursor:
  //                 data.collections.collections[
  //                   data.collections.collections.length - 1
  //                 ].createdAt,
  //             });
  //           }}
  //           isLoading={fetching}
  //           m="auto"
  //           my={8}
  //         >
  //           load more
  //         </Button>
  //       </Flex>
  //     ) : null}
  //   </Layout>
  // );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
