import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
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
import { EntryProps } from "../utils/EntryProps";
import { usePrevious } from "../utils/usePrevious";

type SelectAutoCompleteProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  // isGuessing: boolean;
  // collection?: any;
  handleChange(r: EntryProps): any;
  // entries: EntryProps[];
};

type SearchStateProps = {
  searchResults: EntryProps[];
  query: string;
  page: number;
  hasMoreToLoad: boolean;
};

export const SelectAutoComplete: React.FC<SelectAutoCompleteProps> = ({
  size: _,
  label,
  // isGuessing,
  // collection,
  handleChange,
  ...props
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [field, { error }, helpers] = useField(props);
  const [searchState, setSearchState] = useState<SearchStateProps>({
    searchResults: [],
    query: "",
    page: 1,
    hasMoreToLoad: true,
  });
  const prevPage = usePrevious(searchState.page);
  const prevQuery = usePrevious(searchState.query);
  const { setValue } = helpers;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert("You clicked outside of me!");
          setDropdownOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  // var searchInputFieldEl = document.getElementById("searchInputField");
  // var isFocused = document.activeElement === searchInputFieldEl;

  // console.log("isFocused", isFocused);
  // const handleRemoveSelectedEntry = (id: number) => {
  //   setSelectedEntries(
  //     selectedEntries.filter(({ externalId }) => externalId !== id)
  //   );
  // };

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      // Send Axios request here
      if (searchState.query && searchState.query !== prevQuery) {
        var dropdownBox = document.getElementById("dropdownBox");
        await fetchSearch(searchState.query, searchState.page);
        setDropdownOpen(true);
        dropdownBox!.scrollTop = 0;
      }
    }, 1000);
    return () => clearTimeout(delayDebounceFn);
  }, [searchState.query]);

  useEffect(() => {
    if (searchState.query && searchState.query === prevQuery) {
      fetchSearch(searchState.query, searchState.page);
    }
  }, [searchState.page]);

  const fetchSearch = async (query: string, page: number) => {
    try {
      const response = await api.getSearch(query, page);
      const data = await response.json();
      if (data) {
        // console.log("serachresults", data, prevQuery, searchState.query);
        let fetchedResults = data.results.map((r: any) => {
          return {
            externalId: r.id,
            externalTitle: r.title || "",
            externalImagePath: r.poster_path || "",
            externalReleaseDate: r.release_date || "",
          };
        });
        setSearchState({
          ...searchState,
          searchResults:
            page === 1 || query !== prevQuery
              ? fetchedResults
              : // : [...new Set([...searchState.searchResults, ...fetchedResults])],
                [...searchState.searchResults, ...fetchedResults].filter(
                  (item, index) => {
                    return (
                      [...searchState.searchResults, ...fetchedResults].indexOf(
                        item
                      ) === index
                    );
                  }
                ),
          page: query !== prevQuery ? 1 : searchState.page,
          hasMoreToLoad: page >= data.total_pages ? false : true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && searchState.hasMoreToLoad) {
      setSearchState({ ...searchState, page: prevPage + 1 });
    }
  };

  if (!searchState.searchResults) {
    return <div>no search results</div>;
  }

  return (
    <>
      <FormControl isInvalid={!!error}>
        <Flex ref={wrapperRef}>
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
          <InputLeftAddon
            children={label}
            color="gray.200"
            bgColor="gray.500"
            px={2}
            borderWidth={1}
          />
          <InputGroup>
            <Box w="inherit">
              <Input
                id="searchInputField"
                backgroundColor="gray.200"
                color={theme.colors.darkBlue}
                // name={props.name}
                // mb={2}
                placeholder={props.placeholder}
                onChange={(event) =>
                  setSearchState({ ...searchState, query: event.target.value })
                }
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => {}}
                roundedLeft="0"
                _placeholder={{ color: "gray.400" }}
                // w="100%"
              />

              {dropdownOpen && (
                <Box
                  bgColor={theme.colors.lightPurple}
                  borderRadius={4}
                  w="inherit"
                  // left={225}
                  h={searchState.searchResults.length >= 3 ? 120 : "auto"}
                  overflowY="scroll"
                  onScroll={handleScroll}
                  id="dropdownBox"
                  position="absolute"
                  mt={1}
                  zIndex="dropdown"
                >
                  {searchState.searchResults.map((r) =>
                    !r ? null : (
                      <Flex key={r.externalId}>
                        <Button
                          variant="ghost"
                          color={theme.colors.darkBlue}
                          // size="md"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleChange(r);
                          }}
                          w="100%"
                        >
                          {r.externalTitle} ({r.externalReleaseDate.slice(0, 4)}
                          )
                        </Button>
                      </Flex>
                    )
                  )}
                </Box>
              )}
            </Box>
          </InputGroup>
        </Flex>
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    </>
  );
};
