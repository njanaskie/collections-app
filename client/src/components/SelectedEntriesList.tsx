import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import React from "react";
import { API_IMAGE_URL, API_LOGO_SIZE_MD } from "../config/movies-api";
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
    <Box mt="10" pos="inherit">
      <Heading size="md" mb={4}>
        Collection Entries
      </Heading>
      {items.length > 0 ? (
        items.map((i) =>
          !i ? null : (
            <Flex
              // bgColor={theme.colors.superLightBlue}
              key={i.externalId}
              _hover={{ bgColor: theme.colors.darkBlue }}
              // p={4}
              borderWidth={0.5}
              boxShadow="lg"
              justify="space-between"
              my={2}
            >
              <Image
                src={`${API_IMAGE_URL}${API_LOGO_SIZE_MD}${i.externalImagePath}`}
              />
              <Box flex={1} p={2}>
                <Heading size="md" ml={2} noOfLines={2} color="white">
                  {i.externalTitle}
                </Heading>
                <Text ml={2} noOfLines={2} color="white">
                  ({i.externalReleaseDate.slice(0, 4)})
                </Text>
              </Box>
              <Box ml="auto" p={2}>
                <IconButton
                  bgColor={theme.colors.rose}
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
