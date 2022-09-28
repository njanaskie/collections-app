import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Link,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Appeal,
  useApproveAppealMutation,
  useCreateAppealMutation,
  useRejectAppealMutation,
} from "../generated/graphql";
import NextLink from "next/link";
import theme from "../theme";

interface AppealItemProps {
  appeal: Appeal;
  mode: "reviewable" | "submitted";
}
interface CommonProps {
  appeal: Appeal;
}
interface AppealAlertDialogProps {
  dialogType: "approve" | "reject";
  isOpen: boolean;
  onClose: any;
  handleApprove: any;
  handleReject: any;
}

const AppealAlertDialog: React.FC<AppealAlertDialogProps> = ({
  dialogType,
  isOpen,
  onClose,
  handleApprove,
  handleReject,
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null);

  const onConfirm = () => {
    if (dialogType === "approve") {
      handleApprove();
    } else if (dialogType === "reject") {
      handleReject();
    }
    onClose();
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>
          {dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} Appeal?
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        {dialogType === "approve" ? (
          <AlertDialogBody>
            Are you sure you want to approve this appeal?
          </AlertDialogBody>
        ) : dialogType === "reject" ? (
          <AlertDialogBody>
            Are you sure you want to reject this appeal?
          </AlertDialogBody>
        ) : null}
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            No
          </Button>
          <Button ml={3} onClick={onConfirm}>
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Common: React.FC<CommonProps> = ({ appeal }) => {
  return (
    <Flex
      key={`${appeal.collectionId}-${appeal.externalId}`}
      p={4}
      borderWidth={0.5}
      borderRadius={20}
      h={150}
      w={350}
      bgColor="gray.700"
    >
      <Flex
        h={10}
        w={10}
        bgColor="white"
        borderRadius="50%"
        justify="center"
        alignItems="center"
        //   top={30}
      >
        <Text>{appeal.collectionId}</Text>
      </Flex>
      <Image
        // TMDB recommends to cache configuration data
        // TODO: server side cache config
        src={`https://image.tmdb.org/t/p/w45${appeal.externalImagePath}`}
      />
      <Box flex={1}>
        <Heading size="md" ml={2} noOfLines={2} color="white">
          {appeal.externalTitle}
        </Heading>
        <Text ml={2} noOfLines={3} color="white">
          ({appeal.externalReleaseDate.slice(0, 4)})
        </Text>
      </Box>
    </Flex>
  );
};

export const AppealItem: React.FC<AppealItemProps> = ({ appeal, mode }) => {
  const [dialogType, setDialogType] = useState<"approve" | "reject">("reject");
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

  if (mode === "reviewable") {
    return (
      <Flex
        key={`${appeal.collectionId}-${appeal.externalId}`}
        p={4}
        borderWidth={0.5}
        borderRadius={20}
        h={150}
        w={350}
        bgColor="gray.700"
      >
        <Image
          // TMDB recommends to cache configuration data
          // TODO: server side cache config
          src={`https://image.tmdb.org/t/p/w45${appeal.externalImagePath}`}
        />
        <Flex flexDir="column" justify="space-between">
          <Box>
            <Heading size="md" ml={2} noOfLines={2} color="white">
              {appeal.externalTitle}
            </Heading>
            <Text ml={2} noOfLines={3} color="white">
              ({appeal.externalReleaseDate.slice(0, 4)})
            </Text>
          </Box>

          {appeal.collection.titleSnippet && (
            <Heading ml={2} noOfLines={3} color="white" size="xs" pr={2}>
              <NextLink
                href="/collection/[id]"
                as={`/collection/${appeal.collectionId}`}
              >
                <Link _hover={{ color: theme.colors.orange }}>
                  <Text as="i">
                    {/* From:{" "} */}
                    {appeal.collection.titleSnippet.substr(0, 20) + "\u2026"}
                  </Text>
                </Link>
              </NextLink>
            </Heading>
          )}
        </Flex>
        <Flex flexDirection="column" justify="center" ml={2}>
          <IconButton
            mb={2}
            aria-label="Approve appeal"
            icon={<CheckIcon />}
            onClick={() => {
              setDialogType("approve");
              onOpen();
            }}
          />
          <IconButton
            aria-label="Reject appeal"
            icon={<CloseIcon />}
            onClick={() => {
              setDialogType("reject");
              onOpen();
            }}
          />
          <AppealAlertDialog
            dialogType={dialogType}
            isOpen={isOpen}
            onClose={onClose}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        </Flex>
      </Flex>
    );
  }

  if (mode === "submitted") {
    return (
      <Flex
        key={appeal.id}
        p={4}
        borderWidth={0.5}
        borderRadius={20}
        h={150}
        w={350}
        bgColor="gray.700"
      >
        <Image
          // TMDB recommends to cache configuration data
          // TODO: server side cache config
          src={`https://image.tmdb.org/t/p/w45${appeal.externalImagePath}`}
        />
        <Flex flexDir="column" justify="space-between">
          <Box>
            <Heading size="md" ml={2} noOfLines={2} color="white">
              {appeal.externalTitle}
            </Heading>
            <Text ml={2} noOfLines={3} color="white">
              ({appeal.externalReleaseDate.slice(0, 4)})
            </Text>
          </Box>

          {appeal.collection.titleSnippet && (
            <Heading ml={2} noOfLines={3} color="white" size="xs" pr={2}>
              <NextLink
                href="/collection/[id]"
                as={`/collection/${appeal.collectionId}`}
              >
                <Link _hover={{ color: theme.colors.orange }}>
                  <Text as="i">
                    From:{" "}
                    {appeal.collection.titleSnippet.substr(0, 15) + "\u2026"}
                  </Text>
                </Link>
              </NextLink>
            </Heading>
          )}
        </Flex>
        <Flex justify="space-between" flexDirection="column">
          <Badge
            ml={1}
            color={
              appeal.state === "pending"
                ? "orange"
                : appeal.state === "approved"
                ? "green"
                : "red"
            }
            bgColor="transparent"
          >
            {appeal.state}
          </Badge>
        </Flex>
      </Flex>
    );
  }

  return null;
};
