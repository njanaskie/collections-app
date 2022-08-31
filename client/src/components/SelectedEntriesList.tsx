import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import theme from "../theme";
import { EntryProps } from "../utils/EntryProps";

interface SelectedEntriesListProps {
  items: WithoutId[];
  handleRemoveSelectedEntry(id: number): any;
}

export type WithoutId = Omit<EntryProps, "id">;

export const SelectedEntriesList: React.FC<SelectedEntriesListProps> = ({
  items,
  handleRemoveSelectedEntry,
}) => {
  return (
    <Box mt="28" pos="inherit">
      {items.length > 0 ? (
        items.map((i) =>
          !i ? null : (
            <Flex
              key={i.externalId}
              p={4}
              borderWidth={0.5}
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
