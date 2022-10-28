import React from "react";
import { CollectionSnippetFragment } from "../generated/graphql";

interface SaveProps {
  collection: CollectionSnippetFragment;
}

export const Save: React.FC<SaveProps> = () => {
  // const [{ fetching }, saveCollection] = useSaveCollectionMutation();
  return (
    // <Flex alignItems="center">
    //   <Button
    //     onClick={async () => {
    //       await saveCollection({ collectionId: collection.id });
    //     }}
    //     size="sm"
    //     variant="ghost"
    //     aria-label="save collection"
    //     isLoading={fetching}
    //     color="gray.600"
    //   >
    //     {collection.saveStatus === 1 ? <MdBookmark /> : <MdBookmarkBorder />}
    //   </Button>
    // </Flex>
    <div>save</div>
  );
};
