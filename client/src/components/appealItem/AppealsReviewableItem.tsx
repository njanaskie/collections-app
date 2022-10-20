import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import {
  Appeal,
  useApproveAppealMutation,
  useRejectAppealMutation,
} from "../../generated/graphql";
import theme from "../../theme";
import { AlertDialog } from "../AlertDialog";
import { AppealsItem } from "./AppealsItem";

interface AppealsReviewableItemProps {
  appeal: Appeal;
}

export const AppealsReviewableItem: React.FC<AppealsReviewableItemProps> = ({
  appeal,
}) => {
  const [dialogType, setDialogType] =
    useState<"approve-appeal" | "reject-appeal">("reject-appeal");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [approveAppealError, setApproveAppealError] = useState<string>("");
  const [rejectAppealError, setRejectAppealError] = useState<string>("");
  const [, approveAppeal] = useApproveAppealMutation();
  const [, rejectAppeal] = useRejectAppealMutation();

  const handleApprove = async () => {
    const response = await approveAppeal({
      collectionId: appeal.collectionId,
      externalEntry: {
        externalId: appeal.externalId,
        externalTitle: appeal.externalTitle,
        externalImagePath: appeal.externalImagePath,
        externalReleaseDate: appeal.externalReleaseDate,
      },
    });

    if (!response.data?.approveAppeal) {
      setApproveAppealError("Approval failed");
    }
  };

  const handleReject = async () => {
    const response = await rejectAppeal({
      collectionId: appeal.collectionId,
      externalId: appeal.externalId,
    });

    if (!response.data?.rejectAppeal) {
      setRejectAppealError("Rejection failed");
    }
  };

  //   console.log("reviewable keys", `${appeal.collectionId}-${appeal.externalId}`);
  return (
    <AppealsItem
      appeal={appeal}
      children={
        <Flex flexDirection="column" justify="center" ml={2}>
          <IconButton
            mb={2}
            aria-label="Approve appeal"
            bgColor={"teal"}
            icon={<CheckIcon />}
            onClick={() => {
              setDialogType("approve-appeal");
              onOpen();
            }}
          />
          <IconButton
            aria-label="Reject appeal"
            icon={<CloseIcon />}
            bgColor={theme.colors.rose}
            onClick={() => {
              setDialogType("reject-appeal");
              onOpen();
            }}
          />
          <AlertDialog
            dialogType={dialogType}
            isOpen={isOpen}
            onClose={onClose}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        </Flex>
      }
    />
  );
};
