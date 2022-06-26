import React, { InputHTMLAttributes, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
  ComponentWithAs,
  Heading,
  Icon,
  IconButton,
  useToast,
  Tag,
  TagLabel,
  TagLeftIcon,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { Form, Formik, useField } from "formik";
import { InputField } from "./InputField";
import router from "next/router";
import createCollection from "../pages/create-collection";
import * as api from "../utils/moviesApi";
import cacheData from "memory-cache";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { useCreateCorrectGuessMutation } from "../generated/graphql";
import theme from "../theme";
import { randomSelector } from "../utils/randomSelector";
import { correctGuessMessages, incorrectGuessMessages } from "../constants";
import { GuessMessageAlert } from "./GuessMessageAlert";
import { EntryProps } from "../utils/EntryProps";

interface SelectedEntriesListProps {
  items: WithoutId[];
  handleRemoveSelectedEntry(id: number): any;
}

type WithoutId = Omit<EntryProps, "id">;

export const SelectedEntriesList: React.FC<SelectedEntriesListProps> = ({
  items,
  handleRemoveSelectedEntry,
}) => {
  return (
    <Box
      mt="28"
      paddingY={8}
      paddingX={4}
      borderColor="whiteAlpha.200"
      borderWidth={4}
      pos="inherit"
    >
      {items.length > 0 ? (
        items.map((i) =>
          !i ? null : (
            <Flex
              key={i.externalId}
              p={4}
              borderWidth={1}
              //   mb={2}
              justify="space-between"
            >
              <Image
                // TMDB recommends to cache configuration data
                // TODO: server side cache config
                src={`https://image.tmdb.org/t/p/w45${i.externalImagePath}`}
              />
              <Box flex={1}>
                <Heading size="md" ml={2} noOfLines={2} color="white">
                  {i.externalTitle}
                </Heading>
                <Text ml={2} noOfLines={2} color="white">
                  ({i.externalReleaseDate.slice(0, 4)})
                </Text>
              </Box>
              <Box ml="auto">
                <IconButton
                  color="white"
                  aria-label="Remove selected entry"
                  icon={<CloseIcon />}
                  onClick={() => handleRemoveSelectedEntry(i.externalId)}
                />
              </Box>
            </Flex>
          )
        )
      ) : (
        <Text color="white" textAlign="center" p={2}>
          No entries
        </Text>
      )}
    </Box>
  );
};
