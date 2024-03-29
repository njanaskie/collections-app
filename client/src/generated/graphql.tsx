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

export type Appeal = {
  __typename?: 'Appeal';
  appealBy: User;
  appealById: Scalars['Float'];
  appealCount?: Maybe<Scalars['Float']>;
  collection: Collection;
  collectionId: Scalars['Float'];
  createdAt: Scalars['String'];
  externalId: Scalars['Float'];
  externalImagePath: Scalars['String'];
  externalReleaseDate: Scalars['String'];
  externalTitle: Scalars['String'];
  id: Scalars['Float'];
  state: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type AppealInput = {
  collectionId: Scalars['Float'];
  externalEntry: CollectionEntryInput;
};

export type AppealResponse = {
  __typename?: 'AppealResponse';
  appeal?: Maybe<Appeal>;
  errors?: Maybe<Array<FieldError>>;
};

export type Collection = {
  __typename?: 'Collection';
  appeals: Array<Appeal>;
  collectionEntries: Array<CollectionEntry>;
  collectionEntriesLength: Scalars['Float'];
  createdAt: Scalars['String'];
  creator: User;
  creatorId: Scalars['Float'];
  description?: Maybe<Scalars['String']>;
  guesserCompleteness?: Maybe<Scalars['Float']>;
  id: Scalars['Float'];
  points: Scalars['Float'];
  reference: Scalars['String'];
  saveStatus?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  titleSnippet?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  usersCompletedCount: Scalars['Float'];
  voteStatus?: Maybe<Scalars['Int']>;
};

export type CollectionEntry = {
  __typename?: 'CollectionEntry';
  collection: Collection;
  collectionId: Scalars['Float'];
  createdAt: Scalars['String'];
  externalId: Scalars['Float'];
  externalImagePath: Scalars['String'];
  externalReleaseDate: Scalars['String'];
  externalTitle: Scalars['String'];
  id: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type CollectionEntryInput = {
  externalId: Scalars['Float'];
  externalImagePath: Scalars['String'];
  externalReleaseDate: Scalars['String'];
  externalTitle: Scalars['String'];
};

export type CollectionInput = {
  description?: InputMaybe<Scalars['String']>;
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
  createdAt: Scalars['String'];
  guesser: User;
  guesserId: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type CorrectGuessInput = {
  collectionId: Scalars['Float'];
  externalId: Scalars['Float'];
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

export type GuessModeCollectionEntry = {
  __typename?: 'GuessModeCollectionEntry';
  collectionEntry: CollectionEntry;
  collectionEntryId: Scalars['Float'];
  correctCollection: Collection;
  correctCollectionId: Scalars['Float'];
  createdAt: Scalars['String'];
  firstIncorrectCollection: Collection;
  firstIncorrectCollectionId: Scalars['Float'];
  guessModePlayed?: Maybe<GuessModePlayed>;
  guessModesPlayed?: Maybe<GuessModePlayed>;
  id: Scalars['Float'];
  optionsOrder: Array<Scalars['Float']>;
  secondIncorrectCollection: Collection;
  secondIncorrectCollectionId: Scalars['Float'];
  thirdIncorrectCollection: Collection;
  thirdIncorrectCollectionId: Scalars['Float'];
  updatedAt: Scalars['String'];
};

export type GuessModePlayed = {
  __typename?: 'GuessModePlayed';
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  mode: GuessModeCollectionEntry;
  modeId: Scalars['Float'];
  optionId: Scalars['Float'];
  success: Scalars['Boolean'];
  type: Scalars['String'];
  updatedAt: Scalars['String'];
  user: User;
  userId?: Maybe<Scalars['Float']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  approveAppeal: Scalars['Boolean'];
  changePassword: UserResponse;
  createAppeal: AppealResponse;
  createCollection: CollectionResponse;
  createCorrectGuess: CorrectGuessResponse;
  createGuessModePlayed: Scalars['Boolean'];
  deleteCollection: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  insertGuessModeCollectionEntry: Scalars['Boolean'];
  insertMostCompletedCollectionsUsers: Scalars['Boolean'];
  insertMostCreatedCollectionsUsers: Scalars['Boolean'];
  insertMostGuessesUsers: Scalars['Boolean'];
  insertMostVotesUsers: Scalars['Boolean'];
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  rejectAppeal: Scalars['Boolean'];
  saveCollection: Scalars['Boolean'];
  updateCollection?: Maybe<CollectionResponse>;
  updateMissingEntryAttributes: UpdateResponse;
  updateUser?: Maybe<UserResponse>;
  vote: Scalars['Boolean'];
};


export type MutationApproveAppealArgs = {
  collectionId: Scalars['Int'];
  externalEntry: CollectionEntryInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateAppealArgs = {
  appeal: AppealInput;
};


export type MutationCreateCollectionArgs = {
  entries: Array<CollectionEntryInput>;
  input: CollectionInput;
};


export type MutationCreateCorrectGuessArgs = {
  guess: CorrectGuessInput;
};


export type MutationCreateGuessModePlayedArgs = {
  input: PlayedInput;
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


export type MutationRejectAppealArgs = {
  collectionId: Scalars['Int'];
  externalId: Scalars['Int'];
};


export type MutationSaveCollectionArgs = {
  collectionId: Scalars['Int'];
};


export type MutationUpdateCollectionArgs = {
  entries: Array<CollectionEntryInput>;
  id: Scalars['Int'];
  input: CollectionInput;
};


export type MutationUpdateUserArgs = {
  attributes: UserAttributesInput;
  id: Scalars['Int'];
};


export type MutationVoteArgs = {
  collectionId: Scalars['Int'];
};

export type PaginatedAppeals = {
  __typename?: 'PaginatedAppeals';
  appeals: Array<Appeal>;
  hasMore: Scalars['Boolean'];
};

export type PaginatedCollections = {
  __typename?: 'PaginatedCollections';
  collections: Array<Collection>;
  hasMore: Scalars['Boolean'];
  modulus?: Maybe<Scalars['Float']>;
  totalCount: Scalars['Float'];
};

export type PlayedInput = {
  modeId: Scalars['Float'];
  optionId: Scalars['Float'];
  success: Scalars['Boolean'];
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  appealsReviewable: PaginatedAppeals;
  appealsSubmitted: PaginatedAppeals;
  collection?: Maybe<Collection>;
  collections: PaginatedCollections;
  guessModeCollectionEntries: Array<GuessModeCollectionEntry>;
  me?: Maybe<User>;
  mostCompletedCollectionsUsers: Array<TopUser>;
  mostCreatedCollectionsUsers: Array<TopUser>;
  mostGuessesUsers: Array<TopUser>;
  mostVotesUsers: Array<TopUser>;
  myCorrectGuesses?: Maybe<Array<CorrectGuess>>;
  user?: Maybe<UserResponse>;
  userCompletedCollections: PaginatedCollections;
  userCreatedCollections: PaginatedCollections;
  userStartedCollections: PaginatedCollections;
};


export type QueryAppealsReviewableArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
};


export type QueryAppealsSubmittedArgs = {
  limit: Scalars['Int'];
  page: Scalars['Int'];
  state?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionArgs = {
  id?: InputMaybe<Scalars['Int']>;
  reference?: InputMaybe<Scalars['String']>;
};


export type QueryCollectionsArgs = {
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

export type TopUser = {
  __typename?: 'TopUser';
  stat: Scalars['Float'];
  user: User;
  userId: Scalars['Float'];
};

export type UpdateResponse = {
  __typename?: 'UpdateResponse';
  not_updated: Scalars['Float'];
  total: Scalars['Float'];
  updated: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  letterboxd_url?: Maybe<Scalars['String']>;
  totalCorrectGuesses: Scalars['Int'];
  totalLikesReceived: Scalars['Int'];
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

export type CollectionSnippetFragment = { __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, voteStatus?: number | null, collectionEntriesLength: number, creator: { __typename?: 'User', id: number, username: string } };

export type RegularCollectionFragment = { __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, title: string, description?: string | null, points: number, voteStatus?: number | null, creatorId: number, collectionEntriesLength: number, usersCompletedCount: number, creator: { __typename?: 'User', id: number, username: string }, collectionEntries: Array<{ __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string }> };

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null };

export type UserCollectionSnippetFragment = { __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } };

export type UserPaginatedCollectionsFragment = { __typename?: 'PaginatedCollections', hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> };

export type UserSnippetFragment = { __typename?: 'User', id: number, username: string };

export type ApproveAppealMutationVariables = Exact<{
  externalEntry: CollectionEntryInput;
  collectionId: Scalars['Int'];
}>;


export type ApproveAppealMutation = { __typename?: 'Mutation', approveAppeal: boolean };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null } };

export type CreateAppealMutationVariables = Exact<{
  appeal: AppealInput;
}>;


export type CreateAppealMutation = { __typename?: 'Mutation', createAppeal: { __typename?: 'AppealResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, appeal?: { __typename?: 'Appeal', id: number } | null } };

export type CreateCollectionMutationVariables = Exact<{
  input: CollectionInput;
  entries: Array<CollectionEntryInput> | CollectionEntryInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: number, createdAt: string, updatedAt: string, title: string, points: number, creatorId: number } | null } };

export type CreateCorrectGuessMutationVariables = Exact<{
  guess: CorrectGuessInput;
}>;


export type CreateCorrectGuessMutation = { __typename?: 'Mutation', createCorrectGuess: { __typename?: 'CorrectGuessResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, correctGuess?: { __typename?: 'CorrectGuess', collectionEntryId: number, collectionId: number, guesserId: number } | null } };

export type CreateGuessModePlayedMutationVariables = Exact<{
  input: PlayedInput;
}>;


export type CreateGuessModePlayedMutation = { __typename?: 'Mutation', createGuessModePlayed: boolean };

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


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null } };

export type RejectAppealMutationVariables = Exact<{
  externalId: Scalars['Int'];
  collectionId: Scalars['Int'];
}>;


export type RejectAppealMutation = { __typename?: 'Mutation', rejectAppeal: boolean };

export type SaveCollectionMutationVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type SaveCollectionMutation = { __typename?: 'Mutation', saveCollection: boolean };

export type UpdateCollectionMutationVariables = Exact<{
  input: CollectionInput;
  entries: Array<CollectionEntryInput> | CollectionEntryInput;
  id: Scalars['Int'];
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection?: { __typename?: 'CollectionResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, collection?: { __typename?: 'Collection', id: number, title: string, titleSnippet?: string | null } | null } | null };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Int'];
  attributes: UserAttributesInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null } | null };

export type VoteMutationVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type AppealsReviewableQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
}>;


export type AppealsReviewableQuery = { __typename?: 'Query', appealsReviewable: { __typename?: 'PaginatedAppeals', hasMore: boolean, appeals: Array<{ __typename?: 'Appeal', collectionId: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string, appealCount?: number | null, collection: { __typename?: 'Collection', id: number, reference: string, titleSnippet?: string | null } }> } };

export type AppealsSubmittedQueryVariables = Exact<{
  state?: InputMaybe<Scalars['String']>;
  limit: Scalars['Int'];
  page: Scalars['Int'];
}>;


export type AppealsSubmittedQuery = { __typename?: 'Query', appealsSubmitted: { __typename?: 'PaginatedAppeals', hasMore: boolean, appeals: Array<{ __typename?: 'Appeal', id: number, state: string, collectionId: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string, appealById: number, collection: { __typename?: 'Collection', id: number, reference: string, titleSnippet?: string | null } }> } };

export type CollectionQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']>;
  reference?: InputMaybe<Scalars['String']>;
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, title: string, description?: string | null, points: number, voteStatus?: number | null, creatorId: number, collectionEntriesLength: number, usersCompletedCount: number, creator: { __typename?: 'User', id: number, username: string }, collectionEntries: Array<{ __typename?: 'CollectionEntry', id: number, externalId: number, externalTitle: string, externalImagePath: string, externalReleaseDate: string }> } | null };

export type CollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  orderBy?: InputMaybe<Scalars['String']>;
  modulus?: InputMaybe<Scalars['Int']>;
  page: Scalars['Int'];
}>;


export type CollectionsQuery = { __typename?: 'Query', collections: { __typename?: 'PaginatedCollections', modulus?: number | null, hasMore: boolean, collections: Array<{ __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, voteStatus?: number | null, collectionEntriesLength: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export type GuessModeCollectionEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GuessModeCollectionEntriesQuery = { __typename?: 'Query', guessModeCollectionEntries: Array<{ __typename?: 'GuessModeCollectionEntry', id: number, optionsOrder: Array<number>, createdAt: string, updatedAt: string, collectionEntry: { __typename?: 'CollectionEntry', id: number, externalId: number, externalImagePath: string, externalReleaseDate: string, externalTitle: string }, correctCollection: { __typename?: 'Collection', id: number, title: string, reference: string }, firstIncorrectCollection: { __typename?: 'Collection', id: number, title: string, reference: string }, secondIncorrectCollection: { __typename?: 'Collection', id: number, title: string, reference: string }, thirdIncorrectCollection: { __typename?: 'Collection', id: number, title: string, reference: string }, guessModePlayed?: { __typename?: 'GuessModePlayed', optionId: number, success: boolean } | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null };

export type MostCompletedCollectionsUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type MostCompletedCollectionsUsersQuery = { __typename?: 'Query', mostCompletedCollectionsUsers: Array<{ __typename?: 'TopUser', userId: number, stat: number, user: { __typename?: 'User', username: string } }> };

export type MostCreatedCollectionsUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type MostCreatedCollectionsUsersQuery = { __typename?: 'Query', mostCreatedCollectionsUsers: Array<{ __typename?: 'TopUser', userId: number, stat: number, user: { __typename?: 'User', username: string } }> };

export type MostGuessesUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type MostGuessesUsersQuery = { __typename?: 'Query', mostGuessesUsers: Array<{ __typename?: 'TopUser', userId: number, stat: number, user: { __typename?: 'User', username: string } }> };

export type MostVotesUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type MostVotesUsersQuery = { __typename?: 'Query', mostVotesUsers: Array<{ __typename?: 'TopUser', userId: number, stat: number, user: { __typename?: 'User', username: string } }> };

export type MyCorrectGuessesQueryVariables = Exact<{
  collectionId: Scalars['Int'];
}>;


export type MyCorrectGuessesQuery = { __typename?: 'Query', myCorrectGuesses?: Array<{ __typename?: 'CorrectGuess', collectionId: number, collectionEntryId: number, guesserId: number, collectionEntry: { __typename?: 'CollectionEntry', externalId: number } }> | null };

export type UserQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string, createdAt: string, updatedAt: string, bio?: string | null, letterboxd_url?: string | null, twitter_url?: string | null, website_url?: string | null, totalCorrectGuesses: number, totalLikesReceived: number } | null } | null };

export type UserCompletedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserCompletedCollectionsQuery = { __typename?: 'Query', userCompletedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, totalCount: number, collections: Array<{ __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export type UserCreatedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserCreatedCollectionsQuery = { __typename?: 'Query', userCreatedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, totalCount: number, collections: Array<{ __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export type UserStartedCollectionsQueryVariables = Exact<{
  limit: Scalars['Int'];
  page: Scalars['Int'];
  userId: Scalars['Int'];
}>;


export type UserStartedCollectionsQuery = { __typename?: 'Query', userStartedCollections: { __typename?: 'PaginatedCollections', hasMore: boolean, totalCount: number, collections: Array<{ __typename?: 'Collection', id: number, reference: string, createdAt: string, updatedAt: string, titleSnippet?: string | null, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export const CollectionSnippetFragmentDoc = gql`
    fragment CollectionSnippet on Collection {
  id
  reference
  createdAt
  updatedAt
  titleSnippet
  points
  voteStatus
  creator {
    id
    username
  }
  collectionEntriesLength
}
    `;
export const UserSnippetFragmentDoc = gql`
    fragment UserSnippet on User {
  id
  username
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
  reference
  createdAt
  updatedAt
  title
  description
  points
  voteStatus
  creatorId
  creator {
    ...UserSnippet
  }
  collectionEntries {
    ...CollectionEntrySnippet
  }
  collectionEntriesLength
  usersCompletedCount
}
    ${UserSnippetFragmentDoc}
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
  updatedAt
  bio
  letterboxd_url
  twitter_url
  website_url
  totalCorrectGuesses
  totalLikesReceived
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
  reference
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
export const ApproveAppealDocument = gql`
    mutation ApproveAppeal($externalEntry: CollectionEntryInput!, $collectionId: Int!) {
  approveAppeal(externalEntry: $externalEntry, collectionId: $collectionId)
}
    `;

export function useApproveAppealMutation() {
  return Urql.useMutation<ApproveAppealMutation, ApproveAppealMutationVariables>(ApproveAppealDocument);
};
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
export const CreateAppealDocument = gql`
    mutation CreateAppeal($appeal: AppealInput!) {
  createAppeal(appeal: $appeal) {
    errors {
      field
      message
    }
    appeal {
      id
    }
  }
}
    `;

export function useCreateAppealMutation() {
  return Urql.useMutation<CreateAppealMutation, CreateAppealMutationVariables>(CreateAppealDocument);
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
    }
  }
}
    `;

export function useCreateCorrectGuessMutation() {
  return Urql.useMutation<CreateCorrectGuessMutation, CreateCorrectGuessMutationVariables>(CreateCorrectGuessDocument);
};
export const CreateGuessModePlayedDocument = gql`
    mutation CreateGuessModePlayed($input: PlayedInput!) {
  createGuessModePlayed(input: $input)
}
    `;

export function useCreateGuessModePlayedMutation() {
  return Urql.useMutation<CreateGuessModePlayedMutation, CreateGuessModePlayedMutationVariables>(CreateGuessModePlayedDocument);
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
export const RejectAppealDocument = gql`
    mutation RejectAppeal($externalId: Int!, $collectionId: Int!) {
  rejectAppeal(externalId: $externalId, collectionId: $collectionId)
}
    `;

export function useRejectAppealMutation() {
  return Urql.useMutation<RejectAppealMutation, RejectAppealMutationVariables>(RejectAppealDocument);
};
export const SaveCollectionDocument = gql`
    mutation SaveCollection($collectionId: Int!) {
  saveCollection(collectionId: $collectionId)
}
    `;

export function useSaveCollectionMutation() {
  return Urql.useMutation<SaveCollectionMutation, SaveCollectionMutationVariables>(SaveCollectionDocument);
};
export const UpdateCollectionDocument = gql`
    mutation UpdateCollection($input: CollectionInput!, $entries: [CollectionEntryInput!]!, $id: Int!) {
  updateCollection(input: $input, entries: $entries, id: $id) {
    errors {
      ...RegularError
    }
    collection {
      id
      title
      titleSnippet
    }
  }
}
    ${RegularErrorFragmentDoc}`;

export function useUpdateCollectionMutation() {
  return Urql.useMutation<UpdateCollectionMutation, UpdateCollectionMutationVariables>(UpdateCollectionDocument);
};
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: Int!, $attributes: UserAttributesInput!) {
  updateUser(id: $id, attributes: $attributes) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

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
export const AppealsReviewableDocument = gql`
    query AppealsReviewable($limit: Int!, $page: Int!) {
  appealsReviewable(limit: $limit, page: $page) {
    hasMore
    appeals {
      collectionId
      externalId
      externalTitle
      externalImagePath
      externalReleaseDate
      appealCount
      collection {
        id
        reference
        titleSnippet
      }
    }
  }
}
    `;

export function useAppealsReviewableQuery(options: Omit<Urql.UseQueryArgs<AppealsReviewableQueryVariables>, 'query'>) {
  return Urql.useQuery<AppealsReviewableQuery>({ query: AppealsReviewableDocument, ...options });
};
export const AppealsSubmittedDocument = gql`
    query AppealsSubmitted($state: String, $limit: Int!, $page: Int!) {
  appealsSubmitted(state: $state, limit: $limit, page: $page) {
    hasMore
    appeals {
      id
      state
      collectionId
      externalId
      externalTitle
      externalImagePath
      externalReleaseDate
      appealById
      collection {
        id
        reference
        titleSnippet
      }
    }
  }
}
    `;

export function useAppealsSubmittedQuery(options: Omit<Urql.UseQueryArgs<AppealsSubmittedQueryVariables>, 'query'>) {
  return Urql.useQuery<AppealsSubmittedQuery>({ query: AppealsSubmittedDocument, ...options });
};
export const CollectionDocument = gql`
    query Collection($id: Int, $reference: String) {
  collection(id: $id, reference: $reference) {
    ...RegularCollection
  }
}
    ${RegularCollectionFragmentDoc}`;

export function useCollectionQuery(options?: Omit<Urql.UseQueryArgs<CollectionQueryVariables>, 'query'>) {
  return Urql.useQuery<CollectionQuery>({ query: CollectionDocument, ...options });
};
export const CollectionsDocument = gql`
    query Collections($limit: Int!, $orderBy: String, $modulus: Int, $page: Int!) {
  collections(limit: $limit, orderBy: $orderBy, modulus: $modulus, page: $page) {
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
export const GuessModeCollectionEntriesDocument = gql`
    query GuessModeCollectionEntries {
  guessModeCollectionEntries {
    id
    collectionEntry {
      id
      externalId
      externalImagePath
      externalReleaseDate
      externalTitle
    }
    correctCollection {
      id
      title
      reference
    }
    firstIncorrectCollection {
      id
      title
      reference
    }
    secondIncorrectCollection {
      id
      title
      reference
    }
    thirdIncorrectCollection {
      id
      title
      reference
    }
    guessModePlayed {
      optionId
      success
    }
    optionsOrder
    createdAt
    updatedAt
  }
}
    `;

export function useGuessModeCollectionEntriesQuery(options?: Omit<Urql.UseQueryArgs<GuessModeCollectionEntriesQueryVariables>, 'query'>) {
  return Urql.useQuery<GuessModeCollectionEntriesQuery>({ query: GuessModeCollectionEntriesDocument, ...options });
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
export const MostCompletedCollectionsUsersDocument = gql`
    query MostCompletedCollectionsUsers {
  mostCompletedCollectionsUsers {
    userId
    stat
    user {
      username
    }
  }
}
    `;

export function useMostCompletedCollectionsUsersQuery(options?: Omit<Urql.UseQueryArgs<MostCompletedCollectionsUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<MostCompletedCollectionsUsersQuery>({ query: MostCompletedCollectionsUsersDocument, ...options });
};
export const MostCreatedCollectionsUsersDocument = gql`
    query MostCreatedCollectionsUsers {
  mostCreatedCollectionsUsers {
    userId
    stat
    user {
      username
    }
  }
}
    `;

export function useMostCreatedCollectionsUsersQuery(options?: Omit<Urql.UseQueryArgs<MostCreatedCollectionsUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<MostCreatedCollectionsUsersQuery>({ query: MostCreatedCollectionsUsersDocument, ...options });
};
export const MostGuessesUsersDocument = gql`
    query MostGuessesUsers {
  mostGuessesUsers {
    userId
    stat
    user {
      username
    }
  }
}
    `;

export function useMostGuessesUsersQuery(options?: Omit<Urql.UseQueryArgs<MostGuessesUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<MostGuessesUsersQuery>({ query: MostGuessesUsersDocument, ...options });
};
export const MostVotesUsersDocument = gql`
    query MostVotesUsers {
  mostVotesUsers {
    userId
    stat
    user {
      username
    }
  }
}
    `;

export function useMostVotesUsersQuery(options?: Omit<Urql.UseQueryArgs<MostVotesUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<MostVotesUsersQuery>({ query: MostVotesUsersDocument, ...options });
};
export const MyCorrectGuessesDocument = gql`
    query MyCorrectGuesses($collectionId: Int!) {
  myCorrectGuesses(collectionId: $collectionId) {
    collectionId
    collectionEntryId
    guesserId
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
    totalCount
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
    totalCount
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
    totalCount
    collections {
      ...UserCollectionSnippet
    }
  }
}
    ${UserCollectionSnippetFragmentDoc}`;

export function useUserStartedCollectionsQuery(options: Omit<Urql.UseQueryArgs<UserStartedCollectionsQueryVariables>, 'query'>) {
  return Urql.useQuery<UserStartedCollectionsQuery>({ query: UserStartedCollectionsDocument, ...options });
};