import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import React from "react";
import theme from "../theme";

interface AppealAlertDialogProps {
  dialogType: "approve-appeal" | "reject-appeal" | "delete-collection";
  isOpen: boolean;
  onClose: any;
  handleApprove?: any;
  handleReject?: any;
}

export const AlertDialog: React.FC<AppealAlertDialogProps> = ({
  dialogType,
  isOpen,
  onClose,
  handleApprove,
  handleReject,
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null);

  const onConfirm = () => {
    if (dialogType === "approve-appeal" || dialogType === "delete-collection") {
      handleApprove();
    } else if (dialogType === "reject-appeal") {
      handleReject();
    }
    onClose();
  };

  return (
    <ChakraAlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent
        bgColor={theme.colors.darkBlue}
        borderWidth={0.5}
        borderColor="gray.200"
      >
        <AlertDialogHeader color="gray.200">
          {(dialogType.charAt(0).toUpperCase() + dialogType.slice(1)).replace(
            "-",
            " "
          )}
        </AlertDialogHeader>
        <AlertDialogCloseButton color={"white"} />
        {dialogType === "approve-appeal" ? (
          <AlertDialogBody color="gray.200">
            Are you sure you want to approve this appeal?
          </AlertDialogBody>
        ) : dialogType === "reject-appeal" ? (
          <AlertDialogBody color="gray.200">
            Are you sure you want to reject this appeal?
          </AlertDialogBody>
        ) : dialogType === "delete-collection" ? (
          <AlertDialogBody color="gray.200">
            Are you sure you want to delete this collection?
          </AlertDialogBody>
        ) : null}
        <AlertDialogFooter>
          <Button
            ref={cancelRef}
            onClick={onClose}
            bgColor={"gray.500"}
            color="white"
          >
            No
          </Button>
          <Button
            bgColor={theme.colors.green}
            color="white"
            ml={3}
            onClick={onConfirm}
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ChakraAlertDialog>
  );
};
