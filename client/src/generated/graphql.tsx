import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Collection = {
  __typename?: 'Collection';
  collectionEntries: Array<CollectionEntry>;
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  guesserCompleteness?: Maybe<Scalars['Float']>;
  id: Scalars['Float'];
  points: Scalars['Float'];
  title: Scalars['String'];
  titleSnippet?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type CollectionEntry = {
  __typename?: 'CollectionEntry';
  collection: Collection;
  collectionId: Scalars['Float'];
  externalId: Scalars['Float'];
  externalImagePath: Scalars['String'];
  externalReleaseDate: Scalars['String'];
  externalTitle: Scalars['String'];
  id: Scalars['Float'];
};

export type CollectionEntryInput = {
  externalId: Scalars['Float'];
  externalImagePath: Scalars['String'];
  externalReleaseDate: Scalars['String'];
  externalTitle: Scalars['String'];
};

export type CollectionInput = {
  title: Scalars['String'];
};

export type CollectionResponse = {
  __typename?: 'CollectionResponse';
  collection?: Maybe<Collection>;
  errors?: Maybe<Array<FieldError>>;
};

export type CorrectGuess = {
  __typename?: 'CorrectGuess';
  collection: Collection;
  collectionEntry: CollectionEntry;
  collectionEntryId: Scalars['Float'];
  collectionId: Scalars['Float'];
  guesser: User;
  guesserId: Scalars['Float'];
  pending: Scalars['Boolean'];
};

export type CorrectGuessInput = {
  collectionId: Scalars['Float'];
  externalId: Scalars['Float'];
  pending: Scalars['Boolean'];
};

export type CorrectGuessResponse = {
  __typename?: 'CorrectGuessResponse';
  correctGuess?: Maybe<CorrectGuess>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createCollection: CollectionResponse;
  createCorrectGuess: CorrectGuessResponse;
  deleteCollection: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateCollection?: Maybe<CollectionResponse>;
  updateUser?: Maybe<UserResponse>;
  vote: Scalars['Boolean'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateCollectionArgs = {
  entries: Array<CollectionEntryInput>;
  input: CollectionInput;
};


export type MutationCreateCorrectGuessArgs = {
  guess: CorrectGuessInput;
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationUpdateCollectionArgs = {
  entries: Array<CollectionEntryInput>;
  id: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  attributes: UserAttributesInput;
  id: Scalars['Int'];
};


export type MutationVoteArgs = {
  collectionId: Scalars['Int'];
};

export type PaginatedCollections = {
  __typename?: 'PaginatedCollections';
  collections: Array<Collection>;
  hasMore: Scalars['Boolean'];
  modulus?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  collection?: Maybe<Collection>;
  collections: PaginatedCollections;
  me?: Maybe<User>;
  myCorrectGuesses?: Maybe<Array<CorrectGuess>>;
  user?: Maybe<UserResponse>;
  userCompletedCollections: PaginatedCollections;
  userCreatedCollections: PaginatedCollections;
  userStartedCollections: PaginatedCollections;
};


export type QueryCollectionArgs = {
  id: Scalars['Int'];
};


export type QueryCollectionsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  modulus?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Scalars['String']>;
  page: Scalars['Int'];
};


export type QueryMyCorrectGuessesArgs = {
  collectionId: Scalars['Int'];
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};


export type QueryUserCompletedCollectionsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
};


export type QueryUserCreatedCollectionsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
};


export type QueryUserStartedCollectionsArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  letterboxd_url?: Maybe<Scalars['String']>;
  twitter_url?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  website_url?: Maybe<Scalars['String']>;
};

export type UserAttributesInput = {
  avatar?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  letterboxd_url?: InputMaybe<Scalars['String']>;
  twitter_url?: InputMaybe<Scalars['String']>;
  website_url?: InputMaybe<Scalars['String']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type CollectionEntrySnippetFragment = { __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string };

export type CollectionSnippetFragment = { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, voteStatus?: number | null, creator: { __typename?: 'User', id: number, username: string } };

export type RegularCollectionFragment = { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, title: string, points: number, voteStatus?: number | null, guesserCompleteness?: number | null, creator: { __typename?: 'User', id: number, username: string }, collectionEntries: Array<{ __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string }> };

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null };

export type UserCollectionSnippetFragment = { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } };

export type UserPaginatedCollectionsFragment = { __typename?: 'PaginatedCollections', hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> };

export type UserSnippetFragment = { __typename?: 'User', id: number, username: string };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null } };

export type CreateCollectionMutationVariables = Exact<{
  input: CollectionInput;
  entries: Array<CollectionEntryInput> | CollectionEntryInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number } | null } };

export type CreateCorrectGuessMutationVariables = Exact<{
  guess: CorrectGuessInput;
}>;


export type CreateCorrectGuessMutation = { __typename?: 'Mutation', createCorrectGuess: { __typename?: 'CorrectGuessResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, correctGuess?: { __typename?: 'CorrectGuess', collectionEntryId: number, collectionId: number, guesserId: number, pending: boolean } | null } };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null } };

export type UpdateCollectionMutationVariables = Exact<{
  title: Scalars['String'];
  entries: Array<CollectionEntryInput> | CollectionEntryInput;
  id: Scalars['Int'];
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection?: { __typename?: 'CollectionResponse', collection?: { __typename?: 'Collection', id: number, title: string, titleSnippet?: string | null, collectionEntries: Array<{ __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string }> } | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Int'];
  attributes: UserAttributesInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null } | null };

export type VoteMutationVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type CollectionQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, title: string, points: number, voteStatus?: number | null, creatorId: number, guesserCompleteness?: number | null, creator: { __typename?: 'User', id: number, username: string }, collectionEntries: Array<{ __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string }> } | null };

export type CollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: InputMaybe<Scalars['String']>;
  orderBy?: InputMaybe<Scalars['String']>;
  modulus?: InputMaybe<Scalars['Int']>;
  page: Scalars['Int'];
}>;


export type CollectionsQuery = { __typename?: 'Query', collections: { __typename?: 'PaginatedCollections', modulus?: number | null, hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, voteStatus?: number | null, creator: { __typename?: 'User', id: number, username: string } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null };

export type MyCorrectGuessesQueryVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type MyCorrectGuessesQuery = { __typename?: 'Query', myCorrectGuesses?: Array<{ __typename?: 'CorrectGuess', collectionId: number, collectionEntryId: number, guesserId: number, pending: boolean, collectionEntry: { __typename?: 'CollectionEntry', externalId: number } }> | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null } | null } | null };

export type UserCompletedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserCompletedCollectionsQuery = { __typename?: 'Query', userCompletedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export type UserCreatedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserCreatedCollectionsQuery = { __typename?: 'Query', userCreatedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export type UserStartedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserStartedCollectionsQuery = { __typename?: 'Query', userStartedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export const CollectionSnippetFragmentDoc = gql`
    fragment CollectionSnippet on Collection {
  id
  createdAt
  updatedAt
  titleSnippet
  points
  voteStatus
  creator {
    id
    username
  }
}
    `;
export const CollectionEntrySnippetFragmentDoc = gql`
    fragment CollectionEntrySnippet on CollectionEntry {
  id
  externalId
  externalTitle
  externalImagePath
  externalReleaseDate
}
    `;
export const RegularCollectionFragmentDoc = gql`
    fragment RegularCollection on Collection {
  id
  createdAt
  updatedAt
  title
  points
  voteStatus
  creator {
    id
    username
  }
  guesserCompleteness
  collectionEntries {
    ...CollectionEntrySnippet
  }
}
    ${CollectionEntrySnippetFragmentDoc}`;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  createdAt
  bio
  letterboxd_url
  twitter_url
  website_url
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const UserCollectionSnippetFragmentDoc = gql`
    fragment UserCollectionSnippet on Collection {
  id
  createdAt
  updatedAt
  titleSnippet
  points
  creator {
    id
    username
  }
}
    `;
export const UserPaginatedCollectionsFragmentDoc = gql`
    fragment UserPaginatedCollections on PaginatedCollections {
  hasMore
  collections {
    ...UserCollectionSnippet
  }
}
    ${UserCollectionSnippetFragmentDoc}`;
export const UserSnippetFragmentDoc = gql`
    fragment UserSnippet on User {
  id
  username
}
    `;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateCollectionDocument = gql`
    mutation CreateCollection($input: CollectionInput!, $entries: [CollectionEntryInput!]!) {
  createCollection(input: $input, entries: $entries) {
    errors {
      field
      message
    }
    collection {
      id
      createdAt
      updatedAt
      title
      points
      creatorId
    }
  }
}
    `;

export function useCreateCollectionMutation() {
  return Urql.useMutation<CreateCollectionMutation, CreateCollectionMutationVariables>(CreateCollectionDocument);
};
export const CreateCorrectGuessDocument = gql`
    mutation CreateCorrectGuess($guess: CorrectGuessInput!) {
  createCorrectGuess(guess: $guess) {
    errors {
      field
      message
    }
    correctGuess {
      collectionEntryId
      collectionId
      guesserId
      pending
    }
  }
}
    `;

export function useCreateCorrectGuessMutation() {
  return Urql.useMutation<CreateCorrectGuessMutation, CreateCorrectGuessMutationVariables>(CreateCorrectGuessDocument);
};
export const DeleteCollectionDocument = gql`
    mutation DeleteCollection($id: Int!) {
  deleteCollection(id: $id)
}
    `;

export function useDeleteCollectionMutation() {
  return Urql.useMutation<DeleteCollectionMutation, DeleteCollectionMutationVariables>(DeleteCollectionDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const UpdateCollectionDocument = gql`
    mutation UpdateCollection($title: String!, $entries: [CollectionEntryInput!]!, $id: Int!) {
  updateCollection(title: $title, entries: $entries, id: $id) {
    collection {
      id
      title
      titleSnippet
      collectionEntries {
        id
        externalId
        externalTitle
        externalImagePath
        externalReleaseDate
      }
    }
  }
}
    `;

export function useUpdateCollectionMutation() {
  return Urql.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(UpdateCollectionDocument);
};
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: Int!, $attributes: UserAttributesInput!) {
  updateUser(id: $id, attributes: $attributes) {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;

export function useUpdateUserMutation() {
  return Urql.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument);
};
export const VoteDocument = gql`
    mutation Vote($collectionId: Int!) {
  vote(collectionId: $collectionId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};
export const CollectionDocument = gql`
    query Collection($id: Int!) {
  collection(id: $id) {
    id
    createdAt
    updatedAt
    title
    points
    voteStatus
    creatorId
    creator {
      ...UserSnippet
    }
    collectionEntries {
      ...CollectionEntrySnippet
    }
    guesserCompleteness
  }
}
    ${UserSnippetFragmentDoc}
${CollectionEntrySnippetFragmentDoc}`;

export function useCollectionQuery(options: Omit<Urql.UseQueryArgs<CollectionQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionQuery>({ query: CollectionDocument, ...options });
};
export const CollectionsDocument = gql`
    query Collections($limit: Int!, $cursor: String, $orderBy: String, $modulus: Int, $page: Int!) {
  collections(
    limit: $limit
    cursor: $cursor
    orderBy: $orderBy
    modulus: $modulus
    page: $page
  ) {
    modulus
    hasMore
    collections {
      ...CollectionSnippet
    }
  }
}
    ${CollectionSnippetFragmentDoc}`;

export function useCollectionsQuery(options: Omit<Urql.UseQueryArgs<CollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionsQuery>({ query: CollectionsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyCorrectGuessesDocument = gql`
    query MyCorrectGuesses($collectionId: Int!) {
  myCorrectGuesses(collectionId: $collectionId) {
    collectionId
    collectionEntryId
    guesserId
    pending
    collectionEntry {
      externalId
    }
  }
}
    `;

export function useMyCorrectGuessesQuery(options: Omit<Urql.UseQueryArgs<MyCorrectGuessesQueryVariables>, 'query'>) {
  return Urql.useQuery<MyCorrectGuessesQuery>({ query: MyCorrectGuessesDocument, ...options });
};
export const UserDocument = gql`
    query User($id: Int!) {
  user(id: $id) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery>({ query: UserDocument, ...options });
};
export const UserCompletedCollectionsDocument = gql`
    query UserCompletedCollections($limit: Int!, $page: Int!, $userId: Int!) {
  userCompletedCollections(limit: $limit, page: $page, userId: $userId) {
    hasMore
    collections {
      ...UserCollectionSnippet
    }
  }
}
    ${UserCollectionSnippetFragmentDoc}`;

export function useUserCompletedCollectionsQuery(options: Omit<Urql.UseQueryArgs<UserCompletedCollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserCompletedCollectionsQuery>({ query: UserCompletedCollectionsDocument, ...options });
};
export const UserCreatedCollectionsDocument = gql`
    query UserCreatedCollections($limit: Int!, $page: Int!, $userId: Int!) {
  userCreatedCollections(limit: $limit, page: $page, userId: $userId) {
    hasMore
    collections {
      ...UserCollectionSnippet
    }
  }
}
    ${UserCollectionSnippetFragmentDoc}`;

export function useUserCreatedCollectionsQuery(options: Omit<Urql.UseQueryArgs<UserCreatedCollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserCreatedCollectionsQuery>({ query: UserCreatedCollectionsDocument, ...options });
};
export const UserStartedCollectionsDocument = gql`
    query UserStartedCollections($limit: Int!, $page: Int!, $userId: Int!) {
  userStartedCollections(limit: $limit, page: $page, userId: $userId) {
    hasMore
    collections {
      ...UserCollectionSnippet
    }
  }
}
    ${UserCollectionSnippetFragmentDoc}`;

export function useUserStartedCollectionsQuery(options: Omit<Urql.UseQueryArgs<UserStartedCollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserStartedCollectionsQuery>({ query: UserStartedCollectionsDocument, ...options });
};