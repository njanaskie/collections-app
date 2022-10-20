import { ChevronLeftIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router, { useRouter } from "next/router";
import React from "react";
import { BackButton } from "../../../components/BackButton";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { SelectAutoComplete } from "../../../components/SelectAutoComplete";
import { SelectedEntriesList } from "../../../components/SelectedEntriesList";
import {
  useCollectionQuery,
  useCollectionsQuery,
  useUpdateCollectionMutation,
  useUpdateUserMutation,
} from "../../../generated/graphql";
import theme from "../../../theme";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { EntryProps } from "../../../utils/EntryProps";
import { toErrorMap } from "../../../utils/toErrorMap";
import { useGetCollectionFromUrl } from "../../../utils/useGetCollectionFromUrl";
import { useGetIntId } from "../../../utils/useGetIntId";
import { useGetUserFromUrl } from "../../../utils/useGetUserFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";
import createCollection from "../../create-collection";

function nonEmptyObject(obj: any) {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

export const EditUser = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [{ data, error, fetching }] = useGetUserFromUrl();
  const [, updateUser] = useUpdateUserMutation();

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

  if (!data?.user) {
    return (
      <Layout>
        <Box>Could not find user</Box>
      </Layout>
    );
  }
  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          email: data.user.user?.email || "",
          bio: data.user.user?.bio || "",
          letterboxd_url: data.user.user?.letterboxd_url || "",
          twitter_url: data.user.user?.twitter_url || "",
          website_url: data.user.user?.website_url || "",
        }}
        onSubmit={async (values, { setErrors }) => {
          let submitValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v != "")
          );

          if (data.user?.user) {
            const response = await updateUser({
              id: data.user?.user.id,
              attributes: { ...submitValues, email: values.email },
            });

            if (response.data?.updateUser?.errors) {
              setErrors(toErrorMap(response.data.updateUser.errors));
            } else if (response.data?.updateUser?.user && !response.error) {
              router.back();
            }
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <Flex align="center" justify="space-between">
              <BackButton />
              <Heading size="lg" color={theme.colors.orange}>
                Update Profile
              </Heading>
            </Flex>
            <Divider mt={2} />
            <Box mt={2}>
              <InputField
                name="bio"
                placeholder="Who are you...?"
                label="Bio"
                textarea={true}
              />
            </Box>
            <Box mt={2}>
              <InputField
                name="email"
                placeholder="Input a valid email"
                label="Email"
              />
            </Box>
            <Heading mt={4} size="md" color={theme.colors.orange}>
              Socials
            </Heading>
            <Divider mt={2} />

            <Box mt={2}>
              <InputField
                name="letterboxd_url"
                placeholder="Link to your Letterboxd profile"
                label="Letterboxd"
              />
            </Box>

            <Box mt={2}>
              <InputField
                name="twitter_url"
                placeholder="Link to your Twitter profile"
                label="Twitter"
              />
            </Box>

            <Box mt={2}>
              <InputField
                name="website_url"
                placeholder="Link to a Website"
                label="Website"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              // bgColor={theme.colors.green}
              color="gray.100"
              colorScheme="teal"
              variant="solid"
            >
              Update User
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditUser);
