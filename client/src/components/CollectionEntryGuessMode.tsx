import {
  Flex,
  Heading,
  Image,
  Spinner,
  Text,
  Box,
  Button,
  Tooltip,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { API_IMAGE_URL, API_LOGO_SIZE_LG } from "../config/movies-api";
import {
  useCreateCorrectGuessMutation,
  useCreateGuessModePlayedMutation,
  useGuessModeCollectionEntriesQuery,
  useMeQuery,
} from "../generated/graphql";
import theme from "../theme";
import { ImageNotFound } from "./entry/ImageNotFound";
import { GuessMessageAlert } from "./GuessMessageAlert";
import type { Swiper as SwiperType } from "swiper";
import { ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useIsMobile } from "../utils/useIsMobile";

type CollectionOptionProps = {
  id: number;
  title: string;
  reference: string;
};

export const CollectionEntryGuessMode: React.FC<any> = () => {
  const [{ data: me, fetching: fetchingMe }] = useMeQuery();
  const [, createGuessModePlayed] = useCreateGuessModePlayedMutation();
  const [, createCorrectGuess] = useCreateCorrectGuessMutation();
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [guessMessageState, setGuessMessageState] = useState<
    "correct" | "incorrect" | "no-guess"
  >("no-guess");
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  const [{ data, error, fetching }] = useGuessModeCollectionEntriesQuery();
  const mobile = useIsMobile();

  const handleCorrectGuess = async (
    entryCollectionId: number,
    optionCollectionId: number,
    entryId: number,
    entryExternalId: number
  ) => {
    if (entryCollectionId === optionCollectionId) {
      const response = await createCorrectGuess({
        guess: {
          collectionId: optionCollectionId,
          externalId: entryExternalId,
        },
      });

      if (response.data?.createCorrectGuess.errors) {
        console.log(response.data.createCorrectGuess.errors);
      }

      if (!response.data?.createCorrectGuess.errors && !response.error) {
        await createGuessModePlayed({
          input: {
            type: "collection-entry",
            modeId: entryId,
            optionId: optionCollectionId,
            success: true,
          },
        });
        setGuessMessageState("correct");
      }
    } else {
      await createGuessModePlayed({
        input: {
          type: "collection-entry",
          modeId: entryId,
          optionId: optionCollectionId,
          success: false,
        },
      });
      setGuessMessageState("incorrect");
    }

    setDisableButtons(true);
    setTimeout(() => {
      setGuessMessageState("no-guess");
      if (swiper && !swiper.destroyed) {
        swiper.slideNext();
      }
      setDisableButtons(false);
    }, 3000);
  };

  const handleOptionClick = (optionId: number) => {
    if (selectedOption === optionId) {
      setSelectedOption(-1);
    } else {
      setSelectedOption(optionId);
    }
  };

  if (!data && fetching) {
    return <Spinner />;
  }

  let body = (
    <Swiper
      allowTouchMove={false}
      modules={[Pagination]}
      onSwiper={setSwiper}
      pagination={{
        clickable: true,
      }}
    >
      {data?.guessModeCollectionEntries &&
      data?.guessModeCollectionEntries.length > 0 ? (
        data?.guessModeCollectionEntries.map((entry) =>
          !entry ? null : (
            <SwiperSlide key={entry.id} style={{ padding: 0.5 }}>
              {() => (
                <Flex direction={["column", "row"]}>
                  <Box w={160} mb={2} alignSelf={mobile ? "center" : undefined}>
                    {entry.collectionEntry.externalImagePath ? (
                      <Image
                        borderRadius={8}
                        src={`${API_IMAGE_URL}${API_LOGO_SIZE_LG}${entry.collectionEntry.externalImagePath}`}
                      />
                    ) : (
                      <ImageNotFound />
                    )}
                    <Heading size="md" color="gray.200" mt={1} w="inherit">
                      {entry.collectionEntry.externalTitle}
                    </Heading>
                    <Text color="gray.200" fontSize="sm" w="inherit">
                      ({entry.collectionEntry.externalReleaseDate.slice(0, 4)})
                    </Text>
                  </Box>
                  <Flex direction="column" ml={2} flexGrow={1}>
                    {entry.optionsOrder
                      .map(
                        (o) =>
                          [
                            entry.correctCollection,
                            entry.firstIncorrectCollection,
                            entry.secondIncorrectCollection,
                            entry.thirdIncorrectCollection,
                          ][o]
                      )
                      .map((collection: CollectionOptionProps) => (
                        <Flex key={collection.id}>
                          <Tooltip
                            label={collection.title}
                            isDisabled={collection?.title?.length < 50}
                          >
                            <ButtonGroup
                              isAttached
                              variant="unstyled"
                              borderColor={
                                entry.guessModePlayed?.optionId ===
                                  collection.id && entry.guessModePlayed.success
                                  ? theme.colors.green
                                  : entry.guessModePlayed?.optionId ===
                                      collection.id &&
                                    !entry.guessModePlayed.success
                                  ? theme.colors.rose
                                  : "whiteAlpha.400"
                              }
                              borderRadius={9}
                              borderWidth={2}
                              flexGrow={1}
                              mb={2}
                              color={"gray.200"}
                            >
                              <Button
                                bgColor={
                                  selectedOption === collection.id &&
                                  entry.guessModePlayed === null
                                    ? "teal"
                                    : undefined
                                }
                                flexGrow={1}
                                _hover={{ bgColor: "teal" }}
                                onClick={() => handleOptionClick(collection.id)}
                                isDisabled={
                                  disableButtons ||
                                  entry.guessModePlayed !== null
                                }
                                whiteSpace="normal"
                                wordBreak="break-word"
                              >
                                <Text px={1} noOfLines={1}>
                                  {collection.title}
                                </Text>
                              </Button>

                              <NextLink
                                href="/collection/[id]"
                                as={`/collection/${collection.reference}`}
                              >
                                <IconButton
                                  aria-label="Go to collection"
                                  icon={<ExternalLinkIcon />}
                                  size="xs"
                                />
                              </NextLink>
                            </ButtonGroup>
                          </Tooltip>
                        </Flex>
                      ))}
                    <Box alignSelf={"flex-end"}>
                      <Button
                        w={100}
                        color="white"
                        bgColor={"teal"}
                        type="submit"
                        _hover={{ bg: "#319795" }}
                        onClick={() =>
                          handleCorrectGuess(
                            entry.correctCollection.id,
                            selectedOption,
                            entry.id,
                            entry.collectionEntry.externalId
                          )
                        }
                        isDisabled={
                          disableButtons || entry.guessModePlayed !== null
                        }
                      >
                        Guess
                      </Button>
                    </Box>
                    <Flex h={8} mt={2} alignSelf={"flex-end"}>
                      {guessMessageState !== "no-guess" ? (
                        <GuessMessageAlert
                          guessMessageState={guessMessageState}
                        />
                      ) : null}
                    </Flex>
                  </Flex>
                </Flex>
              )}
            </SwiperSlide>
          )
        )
      ) : (
        <Text>Nothing here...</Text>
      )}
    </Swiper>
  );

  return (
    <Box borderRadius={10} p={10} bgColor="blackAlpha.400">
      <Flex justify={"space-between"}>
        <Box>
          <Heading size="md" color={theme.colors.superLightBlue}>
            Match the film to the collection
          </Heading>
          <Text
            letterSpacing="tight"
            color={theme.colors.superLightBlue}
            mb={4}
          >
            You get one guess per film. Films refresh every few days.
          </Text>
        </Box>
        {!me?.me ? (
          <Tooltip label="Create an account to use this mode">
            <InfoOutlineIcon color={"white"} />
          </Tooltip>
        ) : null}
      </Flex>
      {body}
      {data?.guessModeCollectionEntries &&
      data?.guessModeCollectionEntries.length > 0 &&
      data?.guessModeCollectionEntries.every(
        (entry: any) => entry.guessModePlayed !== null
      ) ? (
        <Text
          letterSpacing="tight"
          color={theme.colors.superLightBlue}
          mt={4}
          textColor={theme.colors.lightOrange}
        >
          You've finished all of today's matching games. Come back later for
          more...
        </Text>
      ) : null}
    </Box>
  );
};
