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
  Stack,
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
import { SelectedEntriesList } from "./SelectedEntriesList";

type SelectAutoCompleteProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  isGuessing: boolean;
  collection?: any;
  handleChange(r: EntryProps): any;
  // entries: EntryProps[];
};

interface EntryProps {
  // __typename?: any;
  externalId: number;
  externalTitle: string;
  externalImagePath: string;
  externalReleaseDate: string;
}

export const SelectAutoComplete: React.FC<SelectAutoCompleteProps> = ({
  size: _,
  label,
  isGuessing,
  collection,
  handleChange,
  ...props
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [, createCorrectGuess] = useCreateCorrectGuessMutation();
  const [field, { error }, helpers] = useField(props);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [searchResults, setSearchResults] = useState<EntryProps[]>([]);
  // const [selectedEntries, setSelectedEntries] = useState<EntryProps[]>([]);
  const { setValue } = helpers;
  // var searchInputFieldEl = document.getElementById("searchInputField");
  // var isFocused = document.activeElement === searchInputFieldEl;

  // console.log("isFocused", isFocused);
  // const handleRemoveSelectedEntry = (id: number) => {
  //   setSelectedEntries(
  //     selectedEntries.filter(({ externalId }) => externalId !== id)
  //   );
  // };

  // const handleChange = async (r: any) => {
  //   if (isGuessing) {
  //     console.log(collection.collectionEntries, r);
  //     setDropdownOpen(false);
  //     if (
  //       collection.collectionEntries
  //         .map((e: EntryProps) => e.externalId)
  //         .includes(r.externalId)
  //     ) {
  //       const response = await createCorrectGuess({
  //         guess: {
  //           collectionId: collection.id,
  //           externalId: r.externalId,
  //           pending: false,
  //         },
  //       });

  //       if (!response.error) {
  //         console.log("guessed correctly");
  //         setIsGuessCorrect(true);
  //       }
  //     } else {
  //       setIsGuessCorrect(false);
  //     }
  //   } else {
  //     setSelectedEntries([...selectedEntries, r]);
  //   }
  // };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // console.log("field value: ", searchTerm);
      // Send Axios request here
      if (searchTerm) {
        await fetchSearch(searchTerm);
        setDropdownOpen(true);
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // useEffect(() => {
  //   setSelectedEntries(field.value);
  // }, []);

  // useEffect(() => {
  //   setValue(selectedEntries);
  // }, [selectedEntries]);

  const fetchSearch = async (query: string) => {
    try {
      const response = await api.getSearch(query);
      const data = await response.json();
      if (data) {
        setSearchResults(
          data.results.map((r: any) => {
            return {
              externalId: r.id,
              externalTitle: r.title,
              externalImagePath: r.poster_path,
              externalReleaseDate: r.release_date,
            };
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  if (!searchResults) {
    return <div>no search results</div>;
  }
  return (
    <>
      <Box w="inherit">
        {/* <Flex align="center"> */}
        {/* <Box w={150} bgColor={theme.colors.darkBlue} h={10}>
            <FormLabel
              htmlFor={field.name}
              color="gray.200"
              justifySelf="center"
            >
              {label}
            </FormLabel>
          </Box> */}
        {/* <Box w={650}> */}
        <InputGroup>
          <InputLeftAddon children={label} color="gray.200" />
          <Box w="inherit">
            <Input
              id="searchInputField"
              backgroundColor="gray.200"
              color={theme.colors.darkBlue}
              // name={props.name}
              mb={2}
              placeholder={props.placeholder}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => {}}
              roundedLeft="0"
              // w="100%"
            />
            {dropdownOpen && (
              <Box
                bgColor={theme.colors.lightPurple}
                borderRadius={4}
                // pos="relative"
                // w={675}
                // left={225}
              >
                {searchResults.slice(0, 3).map((r) =>
                  !r ? null : (
                    <Flex key={r.externalId}>
                      <Button
                        variant="ghost"
                        color={theme.colors.darkBlue}
                        size="md"
                        onClick={() => {
                          setDropdownOpen(false);
                          handleChange(r);
                        }}
                        w="100%"
                      >
                        {r.externalTitle} ({r.externalReleaseDate.slice(0, 4)})
                      </Button>
                    </Flex>
                  )
                )}
              </Box>
            )}
          </Box>
        </InputGroup>
      </Box>
      {/* </Flex> */}
      {/* </Box> */}
      {/* {!isGuessing && (
        // <SelectedEntriesList
        //   items={selectedEntries}
        //   handleRemoveSelectedEntry={handleRemoveSelectedEntry}
        // />
        // <Box mt={8} borderColor="whiteAlpha.200" borderWidth={4}>
        //   {selectedEntries.length > 0 ? (
        //     selectedEntries.map((i) =>
        //       !i ? null : (
        //         <Flex
        //           key={i.externalId}
        //           p={4}
        //           borderWidth={1}
        //           mb={2}
        //           justify="space-between"
        //         >
        //           <Image
        //             // TMDB recommends to cache configuration data
        //             // TODO: server side cache config
        //             src={`https://image.tmdb.org/t/p/w92${i.externalImagePath}`}
        //           />
        //           <Box flex={1}>
        //             <Heading size="md" ml={2} noOfLines={2}>
        //               {i.externalTitle}
        //             </Heading>
        //             <Text ml={2} noOfLines={2}>
        //               ({i.externalReleaseDate.slice(0, 4)})
        //             </Text>
        //           </Box>
        //           <Box ml="auto">
        //             <IconButton
        //               aria-label="Remove selected entry"
        //               icon={<CloseIcon />}
        //               onClick={() => {
        //                 setSelectedEntries(
        //                   selectedEntries.filter(
        //                     ({ externalId }) => externalId !== i.externalId
        //                   )
        //                 );
        //               }}
        //             />
        //           </Box>
        //         </Flex>
        //       )
        //     )
        //   ) : (
        //     <Text color="white" textAlign="center" p={2}>
        //       No entries
        //     </Text>
        //   )}
        // </Box>
      )} */}
    </>
  );
};
