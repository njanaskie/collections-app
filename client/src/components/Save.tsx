import { Flex, Button, Text, Divider } from "@chakra-ui/react";
import React from "react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import {
  CollectionSnippetFragment,
  useSaveCollectionMutation,
} from "../generated/graphql";

interface SaveProps {
  collection: CollectionSnippetFragment;
}

export const Save: React.FC<SaveProps> = ({ collection }) => {
  const [{ fetching }, saveCollection] = useSaveCollectionMutation();
  return (
    <Flex alignItems="center">
      <Button
        onClick={async () => {
          await saveCollection({ collectionId: collection.id });
        }}
        size="sm"
        variant="ghost"
        aria-label="save collection"
        isLoading={fetching}
        color="gray.600"
      >
        {collection.saveStatus === 1 ? <MdBookmark /> : <MdBookmarkBorder />}
      </Button>
    </Flex>
  );
};
