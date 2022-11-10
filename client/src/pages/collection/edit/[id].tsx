import { Box, Button, Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../../../components/BackButton";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { SelectAutoComplete } from "../../../components/SelectAutoComplete";
import { SelectedEntriesList } from "../../../components/SelectedEntriesList";
import { useUpdateCollectionMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { EntryProps } from "../../../utils/EntryProps";
import { toErrorMap } from "../../../utils/toErrorMap";
import { useGetCollectionFromUrl } from "../../../utils/useGetCollectionFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";

export const EditCollection = ({}) => {
  const router = useRouter();
  useIsAuth();
  // const intId = useGetIntId();
  const [{ data, error, fetching }] = useGetCollectionFromUrl();
  const [, updateCollection] = useUpdateCollectionMutation();

  if (fetching) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div>{error.message}</div>
      </Layout>
    );
  }

  if (!data?.collection) {
    return (
      <Layout>
        <Box>Could not find collection</Box>
      </Layout>
    );
  }
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: data.collection.title,
          description: data.collection.description || "",
          entries: data.collection.collectionEntries
            ? data.collection.collectionEntries.map((entry) => {
                return {
                  // id: entry.id,
                  externalId: entry.externalId,
                  externalTitle: entry.externalTitle,
                  externalImagePath: entry.externalImagePath,
                  externalReleaseDate: entry.externalReleaseDate,
                };
              })
            : [],
        }}
        onSubmit={async (values, { setErrors }) => {
          if (data.collection && data.collection.id) {
            const response = await updateCollection({
              id: data.collection.id,
              entries: values.entries,
              input: {
                title: values.title,
                description: values.description ? values.description : null,
              },
            });

            if (response.data?.updateCollection?.errors) {
              setErrors(toErrorMap(response.data?.updateCollection?.errors));
            } else if (response.data?.updateCollection?.collection) {
              router.back();
            }
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <Flex mb={4} mr={4}>
              <BackButton />
              <Heading size="lg" color="white">
                Edit collection
              </Heading>
            </Flex>
            <Divider mb={4} />
            <InputField
              name="title"
              placeholder="The title of your collection"
              label="Title"
              textarea={true}
            />
            <InputField
              name="description"
              placeholder="Enter description"
              label="Description"
              textarea={false}
            />
            <Flex mt={4}>
              <SelectAutoComplete
                name="entries"
                label="Films"
                placeholder="Enter film title..."
                handleChange={(r: EntryProps) =>
                  setValues({ ...values, entries: [...values.entries, r] })
                }
              />
            </Flex>
            {/* <Box mt={20}> */}
            <SelectedEntriesList
              items={values.entries}
              handleRemoveSelectedEntry={(id: number) => {
                setValues({
                  ...values,
                  entries: values.entries.filter(
                    ({ externalId }) => externalId !== id
                  ),
                });
              }}
            />
            {/* </Box> */}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
              variant="solid"
            >
              Update Collection
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditCollection);
