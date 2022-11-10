import {
  Box,
  Button,
  Flex,
  FormErrorMessage,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import {
  RegularCollectionFragment,
  useCreateAppealMutation,
} from "../generated/graphql";
import theme from "../theme";
import { EntryProps } from "../utils/EntryProps";
import { toErrorMap } from "../utils/toErrorMap";
import { SelectAutoComplete } from "./SelectAutoComplete";

interface AppealButtonProps {
  collection: RegularCollectionFragment;
}

export const AppealButton: React.FC<AppealButtonProps> = ({ collection }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [{ error: createAppealError }, createAppeal] =
    useCreateAppealMutation();
  return (
    <>
      <Button
        // ml={2}
        size="sm"
        variant="ghost"
        onClick={onOpen}
        color="gray.200"
        _hover={{ textColor: "gray.400" }}
        _active={{ bg: "none" }}
      >
        Appeal?
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="scale"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent
          bgColor={theme.colors.darkBlue}
          borderWidth={0.5}
          borderColor="gray.200"
        >
          <ModalHeader color="gray.200">Submit an appeal</ModalHeader>
          <ModalCloseButton color="gray.200" />
          <Formik
            initialValues={{
              appeal: {
                collectionId: 0,
                externalEntry: {
                  externalId: 0,
                  externalTitle: "",
                  externalReleaseDate: "",
                  externalImagePath: "",
                },
              },
            }}
            onSubmit={async (values, { setErrors }) => {
              const response = await createAppeal({
                appeal: values.appeal,
              });

              if (response.data?.createAppeal.errors) {
                setErrors(toErrorMap(response.data.createAppeal.errors));
              } else if (response.data?.createAppeal.appeal) {
                onClose();
              }
            }}
          >
            {({ errors, values, setValues }) => (
              <Form>
                <ModalBody>
                  {!!errors.appeal ? (
                    <FormErrorMessage>{errors.appeal}</FormErrorMessage>
                  ) : null}
                  <Text color="gray.200">
                    If you think a film belongs in this collection, submit an
                    appeal for the creator to review. If they approve, the film
                    will be added to the collection and you will be awarded a
                    correct guess.
                  </Text>
                  <Flex
                    // position="absolute"
                    // w={400}
                    // zIndex="dropdown"
                    mt={4}
                  >
                    <SelectAutoComplete
                      name="appeals"
                      label="Appeal"
                      placeholder="Enter film title"
                      handleChange={(r: EntryProps) => {
                        if (collection) {
                          setValues({
                            appeal: {
                              collectionId: collection.id,
                              externalEntry: r,
                            },
                          });
                        } else {
                          console.log("cant submit appeal");
                        }
                      }}
                    />
                  </Flex>
                  <Flex h={20}>
                    {values.appeal.externalEntry.externalTitle ? (
                      <>
                        <Text
                          mt={20}
                          color={theme.colors.lightOrange}
                          // w={"50%"}
                          mr={4}
                          // textAlign="end"
                        >
                          Film you want to appeal:
                        </Text>
                        <Box mt={20}>
                          <Heading
                            size="md"
                            ml={2}
                            noOfLines={2}
                            color={theme.colors.lightOrange}
                          >
                            {values.appeal.externalEntry.externalTitle}
                          </Heading>
                          <Text
                            ml={2}
                            noOfLines={2}
                            color={theme.colors.lightOrange}
                          >
                            (
                            {values.appeal.externalEntry.externalReleaseDate.slice(
                              0,
                              4
                            )}
                            )
                          </Text>
                        </Box>
                      </>
                    ) : null}
                  </Flex>
                </ModalBody>

                <ModalFooter mt={12}>
                  <Button
                    mr={3}
                    onClick={onClose}
                    bgColor={"gray.500"}
                    color="white"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="white"
                    bgColor={theme.colors.green}
                    type="submit"
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
