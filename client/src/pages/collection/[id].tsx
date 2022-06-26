import {
  QuestionIcon,
  QuestionOutlineIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { Box, Heading, SimpleGrid } from "@chakra-ui/layout";
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
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EditDeleteCollectionButtons } from "../../components/EditDeleteCollectionButtons";
import { GuessMessageAlert } from "../../components/GuessMessageAlert";
import { Layout } from "../../components/Layout";
import { SelectAutoComplete } from "../../components/SelectAutoComplete";
import {
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

export const Collection = ({}) => {
  const [createGuessError, setCreateGuessError] = useState<
    Record<string, string>
  >({});
  const [guessMessageState, setGuessMessageState] =
    useState<"correct" | "incorrect" | "no-guess">("no-guess");
  const [, createCorrectGuess] = useCreateCorrectGuessMutation();
  const intId = useGetIntId();
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const [{ data: meData }] = useMeQuery({ pause: isServer() });
  const [{ data, error, fetching }] = useGetCollectionFromUrl();
  const isMe = meData?.me?.id === data?.collection?.creator.id;
  const [{ data: correctGuesses }] = useMyCorrectGuessesQuery({
    variables: { collectionId: intId },
    pause: isServer(),
  });

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setDimensions({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width,
      });
    }
  }, []);

  // useEffect(() => {

  // },[])

  const handleChange = async (r: any) => {
    if (
      data?.collection?.collectionEntries &&
      data.collection.collectionEntries
        .map((e: EntryProps) => e.externalId)
        .includes(r.externalId)
    ) {
      const response = await createCorrectGuess({
        guess: {
          collectionId: data.collection.id,
          externalId: r.externalId,
          pending: false,
        },
      });

      if (response.data?.createCorrectGuess.errors) {
        setCreateGuessError(
          toErrorMap(response.data.createCorrectGuess.errors)
        );
      }

      if (!response.data?.createCorrectGuess.errors && !response.error) {
        console.log("guessed correctly");
        setGuessMessageState("correct");
      }
    } else {
      console.log("incorrect guess");
      setGuessMessageState("incorrect");
    }

    setTimeout(() => {
      setGuessMessageState("no-guess");
      setCreateGuessError({});
    }, 5000);
  };

  if (fetching) {
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
        <Heading size="lg" mb={4} color={theme.colors.lightBlue}>
          {data.collection.title}
        </Heading>
        {isMe ? <EditDeleteCollectionButtons id={data.collection.id} /> : null}
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
              <Flex position="absolute" w={800}>
                <SelectAutoComplete
                  name="guesses"
                  label="Make Your Guess"
                  placeholder="Type movie or tv title"
                  isGuessing={true}
                  collection={data.collection} // exclamation used to ignore TS "object is possibly null or undefined"
                  handleChange={handleChange}
                />
              </Flex>
            </Form>
          )}
        </Formik>
      ) : null}
      <Box h={8} mt={12} ml={158}>
        <GuessMessageAlert guessMessageState={guessMessageState} />
        {createGuessError.correctGuess ? (
          <Alert h="8" status="error">
            {createGuessError.correctGuess}
          </Alert>
        ) : null}
      </Box>
      <Flex
        backgroundColor={theme.colors.darkBlue}
        borderRadius={6}
        p={4}
        minH={450}
        borderWidth={2}
        borderColor={theme.colors.lightBlue}
        // zIndex={-1}
        // position="relative"
        mt={2}
      >
        {data.collection.collectionEntries &&
        data.collection.collectionEntries.length > 0 ? (
          data.collection.collectionEntries.map((entry) => (
            <Flex key={entry.id}>
              <Box overflow="hidden" mr={6}>
                {isMe ||
                correctGuesses?.myCorrectGuesses
                  ?.map((g) => g.collectionEntry.externalId)
                  .includes(entry.externalId) ? (
                  <Flex align="center" flexDirection="column" borderRadius="lg">
                    <Flex
                      borderRadius="lg"
                      borderWidth={!isMe ? 4 : 0}
                      borderColor={!isMe ? theme.colors.green : "gray.200"}
                    >
                      {entry.externalImagePath ? (
                        <Image
                          borderRadius="lg"
                          src={`https://image.tmdb.org/t/p/w92${entry.externalImagePath}`}
                          ref={measuredRef}
                        />
                      ) : (
                        <Flex
                          width="97px"
                          height="145px"
                          borderRadius="lg"
                          // flex={1}
                          // alignContent="center"
                          borderWidth="4px"
                          borderColor="gray.400"
                          align="center"
                          justify="center"
                        >
                          <WarningTwoIcon w={10} h={10} color="gray.400" />
                        </Flex>
                      )}
                    </Flex>

                    <Heading mt={2} size="sm" color="white">
                      {entry.externalTitle}
                    </Heading>
                  </Flex>
                ) : (
                  <Flex
                    width="97px"
                    height="145px"
                    borderRadius="lg"
                    // flex={1}
                    // alignContent="center"
                    borderWidth="4px"
                    borderColor="gray.400"
                    align="center"
                    justify="center"
                  >
                    <QuestionOutlineIcon w={10} h={10} color="gray.400" />
                  </Flex>
                )}
              </Box>
            </Flex>
          ))
        ) : (
          <Box>Could not find collection entries</Box>
        )}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Collection);
