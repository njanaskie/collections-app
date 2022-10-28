import { Alert, Button, Divider, Flex, Heading, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { SelectAutoComplete } from "../components/SelectAutoComplete";
import { SelectedEntriesList } from "../components/SelectedEntriesList";
import { useCreateCollectionMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { EntryProps } from "../utils/EntryProps";
import { toErrorMap } from "../utils/toErrorMap";
import { useIsAuth } from "../utils/useIsAuth";

const CreateCollection: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [{ error: mutationError }, createCollection] =
    useCreateCollectionMutation();
  return (
    <Layout variant="regular">
      <Formik
        initialValues={{
          title: "",
          description: null,
          entries: [] as EntryProps[],
        }}
        onSubmit={async (values, { setErrors }) => {
          // console.log("values", values);
          // const newValues = {
          //   ...values,
          //   entries: Array.from(String(values.entries), (num) => Number(num)),
          // };

          const response = await createCollection({
            input: { title: values.title, description: values.description },
            entries: values.entries,
          });

          if (response.data?.createCollection.errors) {
            setErrors(toErrorMap(response.data.createCollection.errors));
          } else if (response.data?.createCollection.collection) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <Heading size="lg" color="white">
              New collection
            </Heading>
            <Divider mb={4} />

            <Stack spacing={3}>
              {mutationError?.graphQLErrors
                ? mutationError.graphQLErrors.map(({ message }, i) => (
                    <Alert key={i} status="error">
                      {message}
                    </Alert>
                  ))
                : null}
            </Stack>
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
                label="Entries"
                placeholder="Type a film title"
                // isGuessing={false}
                handleChange={(r: EntryProps) => {
                  if (!values.entries.includes(r)) {
                    setValues({ ...values, entries: [...values.entries, r] });
                  }
                }}
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
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateCollection);
