import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import NextLink from "next/link";
import { useDeleteCollectionMutation } from "../generated/graphql";

interface EditDeleteCollectionButtonsProps {
  id: number;
}

export const EditDeleteCollectionButtons: React.FC<EditDeleteCollectionButtonsProps> =
  ({ id }) => {
    const [, deleteCollection] = useDeleteCollectionMutation();

    return (
      <Flex>
        <NextLink href="/collection/edit/[id]" as={`/collection/edit/${id}`}>
          <IconButton
            variant="ghost"
            icon={<EditIcon />}
            aria-label="Edit Collection"
            onClick={() => {}}
          />
        </NextLink>
        <IconButton
          variant="ghost"
          icon={<DeleteIcon />}
          aria-label="Delete Collection"
          onClick={() => {
            if (!id) {
              console.log("no collection id");
              return;
            }
            deleteCollection({ id: id });
            router.push("/");
          }}
        />
      </Flex>
    );
  };
