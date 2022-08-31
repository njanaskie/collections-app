import {
  QuestionIcon,
  QuestionOutlineIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { Box, Divider, Heading, SimpleGrid } from "@chakra-ui/layout";
import {
  Image,
  Flex,
  Grid,
  GridItem,
  Text,
  Skeleton,
  Input,
  InputGroup,
  InputLeftAddon,
  Alert,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditDeleteCollectionButtons } from "../../components/EditDeleteCollectionButtons";
import { GuessMessageAlert } from "../../components/GuessMessageAlert";
import { Layout } from "../../components/Layout";
import { SelectAutoComplete } from "../../components/SelectAutoComplete";
import {
  MyCorrectGuessesQuery,
  useCreateAppealMutation,
  useCreateCorrectGuessMutation,
  useMeQuery,
  useMyCorrectGuessesQuery,
} from "../../generated/graphql";
import theme from "../../theme";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { EntryProps } from "../../utils/EntryProps";
import { isServer } from "../../utils/isServer";
import { toErrorMap } from "../../utils/toErrorMap";
import { useGetCollectionFromUrl } from "../../utils/useGetCollectionFromUrl";
import { useGetIntId } from "../../utils/useGetIntId";
import { Entry } from "../../components/entry/Entry";
import { InfoBox } from "../../components/InfoBox";
import NextLink from "next/link";
import { useLocalStorage } from "../../utils/useLocalStorage";
import { CorrectGuessItem } from "../../utils/CorrectGuessItemProps";

export const Collection = ({}) => {
  const [{ error: createAppealError }, createAppeal] =
    useCreateAppealMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [correctGuessesLocal, setCorrectGuessesLocal] = useLocalStorage(
    "correctGuesses",
    []
  );
  const [createGuessError, setCreateGuessError] = useState<
    Record<string, string>
  >({});
  const [guessMessageState, setGuessMessageState] =
    useState<"correct" | "incorrect" | "no-guess">("no-guess");
  const [, createCorrectGuess] = useCreateCorrectGuessMutation();
  const intId = useGetIntId();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [{ data: meData, fetching: meDataFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ data, error, fetching: collectionFetching }] =
    useGetCollectionFromUrl();
  const isMe = meData?.me?.id === data?.collection?.creator.id;
  const [{ data: correctGuesses, fetching: correctGuessesFetching }] =
    useMyCorrectGuessesQuery({
      variables: { collectionId: intId },
      pause: isServer(),
    });
  const [correctGuessesFinal, setCorrectGuessesFinal] = useState<
    CorrectGuessItem[] | any
  >([]);

  function setTheGuesses() {
    if (meData?.me && correctGuesses?.myCorrectGuesses) {
      console.log("opt1");
      setCorrectGuessesFinal(
        correctGuesses.myCorrectGuesses.map((item) => {
          return {
            collectionId: item.collectionId,
            externalId: item.collectionEntry.externalId,
          };
        })
      );
    } else if (!meData?.me && correctGuessesLocal) {
      console.log("opt2");
      setCorrectGuessesFinal(
        correctGuessesLocal.filter(
          (item: CorrectGuessItem) => item.collectionId == intId
        )
      );
    }
  }

  useEffect(() => {
    if (!meDataFetching && !correctGuessesFetching) {
      setTheGuesses();
    }
  }, [correctGuesses, correctGuessesLocal]);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setDimensions({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      });
    }
  }, []);

  const handleChange = async (r: any) => {
    console.log("guess", r);
    if (
      data?.collection?.collectionEntries &&
      data.collection.collectionEntries
        .map((e: EntryProps) => e.externalId)
        .includes(r.externalId)
    ) {
      document.getElementById(r.externalId)?.scrollIntoView({
        behavior: "smooth",
      });

      if (!meData?.me) {
        var newEntry = {
          collectionId: data.collection.id,
          externalId: r.externalId,
        };
        if (
          !correctGuessesLocal.some(
            (guess: any) =>
              guess.externalId === newEntry.externalId &&
              guess.collectionId === newEntry.collectionId
          )
        ) {
          setCorrectGuessesLocal([...correctGuessesLocal, newEntry]);

          setGuessMessageState("correct");
        }
      } else {
        const response = await createCorrectGuess({
          guess: {
            collectionId: data.collection.id,
            externalId: r.externalId,
          },
        });

        if (response.data?.createCorrectGuess.errors) {
          setCreateGuessError(
            toErrorMap(response.data.createCorrectGuess.errors)
          );
        }

        if (!response.data?.createCorrectGuess.errors && !response.error) {
          setGuessMessageState("correct");
        }
      }
    } else {
      setGuessMessageState("incorrect");
    }

    setTimeout(() => {
      setGuessMessageState("no-guess");
      setCreateGuessError({});
    }, 5000);
  };

  if (collectionFetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (!data?.collection) {
    return (
      <Layout>
        <Box>Could not find collection</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex>
        <Box w="100%">
          {data.collection.creator ? (
            <Heading size="xs" mb={2} color={theme.colors.lightOrange}>
              Created by{" "}
              <NextLink
                href={{
                  pathname: "/user/[username]",
                  query: { id: data.collection.creator.id },
                }}
                as={`/user/${data.collection.creator.username}`}
              >
                <Link _hover={{ color: theme.colors.orange }}>
                  {/* <Text _hover={{ color: theme.colors.gold }}> */}
                  {data.collection.creator.username}
                  {/* </Text> */}
                </Link>
              </NextLink>
            </Heading>
          ) : null}
          <Divider />
          <Heading size="md" mb={4} color={theme.colors.superLightBlue}>
            {data.collection.title}
          </Heading>
        </Box>
        <Box mb={2}>
          <InfoBox
            collection={data.collection}
            isMe={isMe}
            correctGuesses={correctGuessesFinal}
          />

          <>
            <Button
              ml={2}
              size="sm"
              variant="ghost"
              onClick={onOpen}
              color="gray.200"
              _hover={{ textColor: "gray.400" }}
              _active={{ bg: "none" }}
            >
              Appeal?
            </Button>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
              isCentered
              motionPreset="scale"
            >
              <ModalOverlay />
              <ModalContent
                bgColor={theme.colors.darkBlue}
                borderWidth={0.5}
                borderColor="gray.200"
              >
                <ModalHeader color="gray.200">Submit an appeal</ModalHeader>
                <ModalCloseButton />
                <Formik
                  initialValues={{
                    appeal: {
                      collectionId: 0,
                      externalEntry: {
                        externalId: 0,
                        externalTitle: "",
                        externalReleaseDate: "",
                        externalImagePath: "",
                      },
                    },
                  }}
                  onSubmit={async (values, { setErrors }) => {
                    console.log("appeal submit", values);

                    const response = await createAppeal({
                      appeal: values.appeal,
                    });

                    if (response.data?.createAppeal.errors) {
                      setErrors(toErrorMap(response.data.createAppeal.errors));
                    } else if (response.data?.createAppeal.appeal) {
                      onClose();
                    }
                  }}
                >
                  {({ errors, values, setValues }) => (
                    <Form>
                      <ModalBody>
                        {!!errors.appeal ? (
                          <FormErrorMessage>{errors.appeal}</FormErrorMessage>
                        ) : null}
                        <Text color="gray.200">
                          If you think a film is missing from the collection,
                          submit an appeal for the creator to review. If they
                          approve your appeal, the film will be added and you
                          will be rewarded a correct guess.
                        </Text>
                        <Flex
                          position="absolute"
                          w={350}
                          zIndex="dropdown"
                          mt={4}
                        >
                          <SelectAutoComplete
                            name="appeals"
                            label="Appeal"
                            placeholder="Type movie or tv title"
                            handleChange={(r: EntryProps) =>
                              setValues({
                                appeal: {
                                  collectionId: intId,
                                  externalEntry: r,
                                },
                              })
                            }
                          />
                        </Flex>
                        <Flex h={20}>
                          {values.appeal.externalEntry.externalTitle ? (
                            <>
                              <Text
                                mt={20}
                                color={theme.colors.lightOrange}
                                w={"50%"}
                                mr={4}
                                textAlign="end"
                              >
                                This film should be in the collection:
                              </Text>
                              <Box mt={20}>
                                <Heading
                                  size="md"
                                  ml={2}
                                  noOfLines={2}
                                  color={theme.colors.lightOrange}
                                >
                                  {values.appeal.externalEntry.externalTitle}
                                </Heading>
                                <Text
                                  ml={2}
                                  noOfLines={2}
                                  color={theme.colors.lightOrange}
                                >
                                  (
                                  {values.appeal.externalEntry.externalReleaseDate.slice(
                                    0,
                                    4
                                  )}
                                  )
                                </Text>
                              </Box>
                            </>
                          ) : null}
                        </Flex>
                      </ModalBody>

                      <ModalFooter mt={12}>
                        <Button
                          color="white"
                          bgColor={theme.colors.green}
                          mr={3}
                          type="submit"
                        >
                          Submit
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </Form>
                  )}
                </Formik>
              </ModalContent>
            </Modal>
          </>
        </Box>
      </Flex>
      {!isMe ? (
        <Formik
          initialValues={{ guesses: [] }}
          onSubmit={async (values, { setErrors }) => {
            console.log("guess submit", values);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Flex position="absolute" w={850} zIndex="dropdown">
                <SelectAutoComplete
                  name="guesses"
                  label="Make Your Guess"
                  placeholder="Type movie or tv title"
                  // isGuessing={true}
                  // collection={data.collection} // exclamation used to ignore TS "object is possibly null or undefined"
                  handleChange={handleChange}
                />
              </Flex>
            </Form>
          )}
        </Formik>
      ) : null}
      {!isMe ? (
        <Box h={8} mt={12} ml={158}>
          <GuessMessageAlert guessMessageState={guessMessageState} />
          {createGuessError.correctGuess ? (
            <Alert h="8" status="error">
              {createGuessError.correctGuess}
            </Alert>
          ) : null}
        </Box>
      ) : null}
      <Flex
        backgroundColor={theme.colors.darkBlue}
        borderRadius={6}
        // paddingY={4}
        h={450}
        // minH={250}
        // maxH={450}
        borderWidth={2}
        borderColor={theme.colors.lightBlue}
        // zIndex={-1}
        // position="relative"
        mt={2}
      >
        <Flex paddingLeft={6} paddingTop={6} wrap="wrap" overflow="scroll">
          {data.collection.collectionEntries &&
          data.collection.collectionEntries.length > 0 ? (
            data.collection.collectionEntries.map((entry) =>
              correctGuessesFinal ? (
                <Flex key={entry.id} id={entry.externalId.toString()}>
                  <Entry
                    // key={entry.id}
                    entry={entry}
                    isMe={isMe}
                    measuredRef={measuredRef}
                    correctGuesses={correctGuessesFinal}
                    // correctGuessesLocal={correctGuessesLocal}
                  />
                </Flex>
              ) : null
            )
          ) : (
            <Box>Could not find collection entries</Box>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Collection);
