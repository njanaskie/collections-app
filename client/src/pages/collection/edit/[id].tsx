import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { SelectAutoComplete } from "../../../components/SelectAutoComplete";
import { SelectedEntriesList } from "../../../components/SelectedEntriesList";
import {
  useCollectionQuery,
  useCollectionsQuery,
  useUpdateCollectionMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { EntryProps } from "../../../utils/EntryProps";
import { useGetCollectionFromUrl } from "../../../utils/useGetCollectionFromUrl";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useIsAuth } from "../../../utils/useIsAuth";
import createCollection from "../../create-collection";

export const EditCollection = ({}) => {
  const router = useRouter();
  useIsAuth();
  const intId = useGetIntId();
  const [{ data, error, fetching }] = useGetCollectionFromUrl();
  const [, updateCollection] = useUpdateCollectionMutation();

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
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
          // console.log("edit values: ", { ...values });

          // values.entries.forEach((e) => delete e.__typename);
          const response = await updateCollection({
            id: intId,
            entries: values.entries,
            title: values.title,
          });
          // console.log("response", response);
          if (!response.error) {
            router.back();
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Flex mt={4} position="absolute" w={850} zIndex="dropdown">
              <SelectAutoComplete
                name="entries"
                label="Movies"
                placeholder="Movies or TV Shows"
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
