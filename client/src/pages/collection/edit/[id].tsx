import { EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { SelectAutoComplete } from "../../../components/SelectAutoComplete";
import {
  useCollectionQuery,
  useCollectionsQuery,
  useUpdateCollectionMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetCollectionFromUrl } from "../../../utils/useGetCollectionFromUrl";
import { useGetIntId } from "../../../utils/useGetIntId";
import createCollection from "../../create-collection";

export const EditCollection = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, error, fetching }] = useCollectionQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
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
    <Layout variant="small">
      <Formik
        initialValues={{
          title: data.collection.title,
          entries: data.collection.collectionEntries
            ? data.collection.collectionEntries.map((entry) => {
                return {
                  externalId: entry.externalId,
                  externalTitle: entry.externalTitle,
                  externalImagePath: entry.externalImagePath,
                  externalReleaseDate: entry.externalReleaseDate,
                };
              })
            : [],
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log("edit values: ", { ...values });

          // values.entries.forEach((e) => delete e.__typename);
          const response = await updateCollection({
            id: intId,
            ...values,
          });
          if (!response.error) {
            router.back();
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <SelectAutoComplete
                name="entries"
                label="Movies"
                placeholder="Movies or TV Shows"
              />
            </Box>
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
