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
import { Entry } from "../../components/Entry/Entry";
import { InfoBox } from "../../components/InfoBox";
import NextLink from "next/link";

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
        // setFlipped((state) => !state);
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
        <InfoBox
          collection={data.collection}
          isMe={isMe}
          correctGuesses={correctGuesses}
        />
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
                  isGuessing={true}
                  collection={data.collection} // exclamation used to ignore TS "object is possibly null or undefined"
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
              correctGuesses?.myCorrectGuesses ? (
                <Entry
                  key={entry.id}
                  entry={entry}
                  isMe={isMe}
                  measuredRef={measuredRef}
                  correctGuesses={correctGuesses}
                />
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
