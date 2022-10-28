import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import NextLink from "next/link";
import { useDeleteCollectionMutation } from "../generated/graphql";
import { AlertDialog } from "./AlertDialog";
import theme from "../theme";

interface EditDeleteCollectionButtonsProps {
  id: number;
  reference: string;
}

export const EditDeleteCollectionButtons: React.FC<EditDeleteCollectionButtonsProps> =
  ({ id, reference }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [, deleteCollection] = useDeleteCollectionMutation();

    const handleDelete = async () => {
      if (!id) {
        console.log("no collection id");
        return;
      }
      deleteCollection({ id: id });
      router.push("/");
    };

    return (
      <Flex color={theme.colors.darkBlue}>
        <NextLink
          href="/collection/edit/[id]"
          as={`/collection/edit/${reference}`}
        >
          <IconButton
            variant="ghost"
            icon={<EditIcon />}
            aria-label="Edit Collection"
            onClick={() => {}}
            flexGrow={1}
          />
        </NextLink>
        <IconButton
          flexGrow={1}
          variant="ghost"
          icon={<DeleteIcon />}
          aria-label="Delete Collection"
          onClick={() => {
            onOpen();
          }}
        />

        <AlertDialog
          dialogType={"delete-collection"}
          isOpen={isOpen}
          onClose={onClose}
          handleApprove={handleDelete}
        />
      </Flex>
    );
  };
