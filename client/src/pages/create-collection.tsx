import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
import { Form, Formik, useField, useFormikContext } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { SelectAutoComplete } from "../components/SelectAutoComplete";
import { SelectedEntriesList } from "../components/SelectedEntriesList";
import { useCreateCollectionMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

interface EntryProps {
  // __typename?: any;
  externalId: number;
  externalTitle: string;
  externalImagePath: string;
  externalReleaseDate: string;
}

const CreateCollection: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [, createCollection] = useCreateCollectionMutation();
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: "",
          entries: [] as EntryProps[],
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log("values", values);
          // const newValues = {
          //   ...values,
          //   entries: Array.from(String(values.entries), (num) => Number(num)),
          // };

          // const response = await createCollection({
          //   input: { title: values.title },
          //   entries: values.entries,
          // });

          // // if (response.data?.login.errors) {
          // //   setErrors(toErrorMap(response.data.login.errors));
          // // } else if (response.data?.login.user) {
          // if (!response.error) {
          //   router.push("/");
          // }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <Heading size="lg" color="white">
              New collection
            </Heading>
            <Divider mb={4} />
            <InputField
              name="title"
              placeholder="title"
              label="Title"
              textarea={true}
            />
            <Flex mt={4} position="absolute" w={800}>
              <SelectAutoComplete
                name="entries"
                label="Add an entry"
                placeholder="Movies or TV Shows"
                isGuessing={false}
                handleChange={(r: EntryProps) =>
                  setValues({ ...values, entries: [...values.entries, r] })
                }
              />
              <Button
                // mt={4}
                type="submit"
                isLoading={isSubmitting}
                colorScheme="teal"
                variant="solid"
                // size="lg"
                w={150}
                position="relative"
                ml={2}
              >
                Save
              </Button>
            </Flex>
            <Box mt={20}>
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
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateCollection);
