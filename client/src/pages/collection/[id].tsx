import { Box, Divider, Heading } from "@chakra-ui/layout";
import { Alert, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { AppealButton } from "../../components/AppealButton";
import { BackButton } from "../../components/BackButton";
import { Entry } from "../../components/entry/Entry";
import { GuessMessageAlert } from "../../components/GuessMessageAlert";
import { InfoBox } from "../../components/InfoBox";
import { Layout } from "../../components/Layout";
import { SelectAutoComplete } from "../../components/SelectAutoComplete";
import {
  useCreateCorrectGuessMutation,
  useMeQuery,
  useMyCorrectGuessesQuery,
} from "../../generated/graphql";
import theme from "../../theme";
import { CorrectGuessItem } from "../../utils/CorrectGuessItemProps";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { EntryProps } from "../../utils/EntryProps";
import { isServer } from "../../utils/isServer";
import { toErrorMap } from "../../utils/toErrorMap";
import { useGetCollectionFromUrl } from "../../utils/useGetCollectionFromUrl";
import { useIsMobile } from "../../utils/useIsMobile";
import { useLocalStorage } from "../../utils/useLocalStorage";

export const Collection = ({}) => {
  const [correctGuessesLocal, setCorrectGuessesLocal] = useLocalStorage(
    "correctGuesses",
    []
  );
  const [createGuessError, setCreateGuessError] = useState<
    Record<string, string>
  >({});
  const [guessMessageState, setGuessMessageState] = useState<
    "correct" | "incorrect" | "no-guess"
  >("no-guess");
  const [, createCorrectGuess] = useCreateCorrectGuessMutation();
  // const intId = useGetIntId();
  // const stringRef= useGetStringRef();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [{ data: meData, fetching: meDataFetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ data, error, fetching: collectionFetching }] =
    useGetCollectionFromUrl();
  const isMe = meData?.me?.id === data?.collection?.creator.id;
  const [{ data: correctGuesses, fetching: correctGuessesFetching }] =
    useMyCorrectGuessesQuery({
      variables: { collectionId: data?.collection ? data?.collection?.id : -1 },
      pause: isServer() || !data?.collection?.id || collectionFetching,
    });
  const [correctGuessesFinal, setCorrectGuessesFinal] = useState<
    CorrectGuessItem[] | any
  >([]);
  const mobile = useIsMobile();

  // useEffect(() => {
  //   if (data && data?.collection) {
  //     // Always do navigations after the first render
  //     router.push(
  //       `${data.collection.creator.username}/${data.collection?.title}`,
  //       undefined,
  //       { shallow: true }
  //     );
  //   }
  // }, []);

  function setTheGuesses() {
    if (meData?.me && correctGuesses?.myCorrectGuesses) {
      setCorrectGuessesFinal(
        correctGuesses.myCorrectGuesses.map((item) => {
          return {
            collectionId: item.collectionId,
            externalId: item.collectionEntry.externalId,
          };
        })
      );
    } else if (!meData?.me && correctGuessesLocal) {
      setCorrectGuessesFinal(
        correctGuessesLocal.filter(
          (item: CorrectGuessItem) => item.collectionId == data?.collection?.id
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
        var newEntry = {
          collectionId: data.collection.id,
          externalId: r.externalId,
        };
        if (
          correctGuesses?.myCorrectGuesses &&
          !correctGuesses.myCorrectGuesses.some(
            (guess: any) =>
              guess.collectionEntry.externalId === newEntry.externalId &&
              guess.collectionId === newEntry.collectionId
          )
        ) {
          const response = await createCorrectGuess({
            guess: newEntry,
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
        <Spinner />
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

  const InfoBoxSection = (
    <Box>
      <InfoBox
        collection={data.collection}
        isMe={isMe}
        correctGuesses={correctGuessesFinal}
      />

      {!isMe && <AppealButton collection={data.collection} />}
    </Box>
  );
  return (
    <Layout>
      <Flex flexDir={["column", "column", "row"]}>
        <Box w="100%" mr={4}>
          <Flex align="center" mb={2}>
            <BackButton />
            <Box>
              {data.collection.creator ? (
                <Heading size="xs" color={theme.colors.lightOrange}>
                  Created by{" "}
                  <NextLink
                    href={{
                      pathname: "/user/[username]",
                      query: { id: data.collection.creator.id },
                    }}
                    as={`/user/${data.collection.creator.username}`}
                  >
                    <Link _hover={{ color: theme.colors.orange }}>
                      {data.collection.creator.username}
                    </Link>
                  </NextLink>
                </Heading>
              ) : null}
            </Box>
          </Flex>
          {mobile ? <>{InfoBoxSection}</> : null}
          <Divider my={1} />
          <Text as="i" fontSize="sm" color={"gray.200"} overflow="auto">
            {data.collection.description}
          </Text>
          <Heading size="md" mb={4} color={theme.colors.superLightBlue}>
            {data.collection.title}
          </Heading>
        </Box>
        {!mobile ? <>{InfoBoxSection}</> : null}
      </Flex>
      {!isMe ? (
        <>
          <Box h={8} mt={2}>
            {guessMessageState !== "no-guess" ? (
              <GuessMessageAlert guessMessageState={guessMessageState} />
            ) : null}
            {createGuessError.correctGuess ? (
              <Alert h={8} status="error">
                {createGuessError.correctGuess}
              </Alert>
            ) : null}
          </Box>
          <Formik
            initialValues={{ guesses: [] }}
            onSubmit={async (values) => {
              console.log("guess submit", values);
            }}
          >
            {() => (
              <Form>
                <Flex position="inherit">
                  <SelectAutoComplete
                    name="guesses"
                    label="Make Your Guess"
                    placeholder={
                      mobile ? "Guess a film..." : "Enter a film title..."
                    }
                    mobile={mobile}
                    // collection={data.collection} // exclamation used to ignore TS "object is possibly null or undefined"
                    handleChange={handleChange}
                  />
                </Flex>
              </Form>
            )}
          </Formik>
        </>
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
        mt={4}
      >
        <Flex
          direction="row"
          paddingX={2}
          paddingTop={6}
          wrap="wrap"
          overflow="scroll"
          justify={"space-evenly"}
        >
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
