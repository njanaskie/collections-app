import { devtoolsExchange } from "@urql/devtools";
import { Cache, cacheExchange } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import {
  CollectionEntryInput,
  CreateCorrectGuessMutation,
  CreateCorrectGuessMutationVariables,
  DeleteCollectionMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  MyCorrectGuessesDocument,
  RegisterMutation,
  SaveCollectionMutationVariables,
  UpdateCollectionMutationVariables,
  UpdateUserMutationVariables,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServer } from "./isServer";
import { simplePagination } from "./simplePagination";

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error?.message.includes("Not authenticated")) {
          Router.replace("/login");
        }
      })
    );
  };

const invalidateAll = (cache: Cache, fieldName: string, args?: any) => {
  const allFields = cache.inspectFields("Query");
  let fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
  if (args) {
    fieldInfos = fieldInfos.filter((info) => {
      return JSON.stringify(info.arguments) == JSON.stringify(args);
    });
  }
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", fieldName, fi.arguments);
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            "x-forwarded-proto": "https",
            cookie,
          }
        : {
            "x-forwarded-proto": "https",
            cookie: "", // this is diff from tut
          },
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedCollections: () => null,
          CollectionEntry: () => null,
          CorrectGuessResponse: () => null,
          CorrectGuess: () => null,
          UserResponse: () => null,
          RegularUserResponse: () => null,
          Appeal: () => null,
          PaginatedAppeals: () => null,
          TopUser: () => null,
          User: () => null,
          // PaginatedAppealsReviewable: () => null,
        },
        resolvers: {
          Query: {
            collections: simplePagination("collections", "collections"),
            user: (args) => {
              return { __typename: "UserResponse", id: args.id };
              // return data;
            },
            userCompletedCollections: simplePagination(
              "userCompletedCollections",
              "collections"
            ),
            userCreatedCollections: simplePagination(
              "userCreatedCollections",
              "collections"
            ),
            userStartedCollections: simplePagination(
              "userStartedCollections",
              "collections"
            ),
            appealsReviewable: simplePagination("appealsReviewable", "appeals"),
            appealsSubmitted: simplePagination("appealsSubmitted", "appeals"),
            // collection: (data, args) => {
            //   console.log("query collection :", data, args);
            //   return {
            //     //
            //   };
            // },
            // myCorrectGuesses: (data, args) => {
            //   console.log("query mycorrectguesses :", data);
            //   return data.myCorrectGuesses;
            // },
          },
        },
        updates: {
          Mutation: {
            updateUser: (_result, args, cache) => {
              invalidateAll(cache, "user", {
                id: (args as UpdateUserMutationVariables).id,
              });
            },
            // updateUser: (_result, args, cache, info) => {
            // const { attributes, id } = args as UpdateUserMutationVariables;
            // const fragment = gql`
            //   fragment __ on User {
            //     # user {
            //     id
            //     email
            //     bio
            //     letterboxd_url
            //     twitter_url
            //     website_url
            //     # }
            //   }
            // `;
            // console.log("fragment", fragment);

            // const res = cache.writeFragment(fragment, {
            //   id: id,
            //   email: attributes.email,
            //   bio: attributes.bio,
            //   letterboxd_url: attributes.letterboxd_url,
            //   twitter_url: attributes.twitter_url,
            //   website_url: attributes.website_url,
            // });

            // console.log("ressss", res);
            // betterUpdateQuery<UpdateUserMutation, UserQuery>(
            //   cache,
            //   { query: UserDocument },
            //   _result,
            //   (result, query) => {
            //     if (result.updateUser?.errors) {
            //       console.log(
            //         "updaing user error",
            //         result.updateUser?.errors
            //       );
            //       return query;
            //     } else {
            //       console.log("updaing user", result.updateUser?.user);
            //       return {
            //         // __typename: "UserResponse",
            //         user: {
            //           __typename: "UserResponse",
            //           user: result.updateUser?.user,
            //           errors: null,
            //         },
            //       };
            //     }
            //   }
            // );
            // },
            saveCollection: (_result, args, cache) => {
              const { collectionId } = args as SaveCollectionMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Collection {
                    id
                    saveStatus
                  }
                `,
                { id: collectionId } as any
              );
              if (data) {
                // if (data.saveStatus === 1) {
                //   return;
                // }
                cache.writeFragment(
                  gql`
                    fragment ____ on Collection {
                      saveStatus
                    }
                  `,
                  {
                    id: collectionId,
                    saveStatus: data.saveStatus === 1 ? 0 : 1,
                  }
                );
              }
            },
            rejectAppeal: (_result, _args, cache, _info) => {
              invalidateAll(cache, "appealsReviewable");
            },
            approveAppeal: (_result, _args, cache, _info) => {
              invalidateAll(cache, "appealsReviewable");
            },
            createAppeal: (_result, _args, cache, _info) => {
              invalidateAll(cache, "appealsSubmitted");
            },
            // createCorrectGuess: (_result, args, cache, info) => {
            createCorrectGuess: (
              result: CreateCorrectGuessMutation,
              args,
              cache,
              _info
            ) => {
              const { guess } = args as CreateCorrectGuessMutationVariables;
              cache.updateQuery(
                {
                  query: MyCorrectGuessesDocument,
                  variables: {
                    collectionId: guess.collectionId,
                  },
                },
                (data) => {
                  if (!result.createCorrectGuess.errors) {
                    const correctGuesses = data!.myCorrectGuesses as any;
                    // if first correct guess, invalidate usersStartedCollections
                    if (correctGuesses.length === 0) {
                      invalidateAll(cache, "userStartedCollections");
                    }

                    correctGuesses.push({
                      ...result.createCorrectGuess.correctGuess,
                      collectionEntry: {
                        externalId: guess.externalId,
                        __typename: "CollectionEntry",
                      },
                    });
                  }

                  return data;
                }
              );
              // betterUpdateQuery<
              //   CreateCorrectGuessMutation,
              //   MyCorrectGuessesQuery
              // >(
              //   cache,
              //   {
              //     query: MyCorrectGuessesDocument,
              //     variables: { collectionId: guess.collectionId },
              //   },
              //   _result,
              //   (result, query) => {
              //     if (result.createCorrectGuess.errors) {
              //       return query;
              //     } else {
              //       // query.myCorrectGuesses?.push(
              //       //   result.createCorrectGuess.correctGuess
              //       // );
              //       // const existingCorrectGuesses = query
              //       //   ? query.myCorrectGuesses
              //       //   : [];
              //       console.log(
              //         "cache mycorrectguess",
              //         result.createCorrectGuess.correctGuess,
              //         query,
              //         cache
              //       );
              //       return {
              //         __typename: "MyCorrectGuesses",
              //         myCorrectGuesses: query.myCorrectGuesses?.push(
              //           result.createCorrectGuess.correctGuess
              //         ),
              //       };
              //     }
              //   }
              // );
            },
            updateCollection: (_result, args, cache, _info) => {
              const { input, entries, id } =
                args as UpdateCollectionMutationVariables;
              const entriesArray = <CollectionEntryInput[]>entries;
              const entriesWithTypename = entriesArray.map((e) => {
                return { ...e, __typename: "CollectionEntry" };
              });

              cache.writeFragment(
                gql`
                  fragment ___ on Collection {
                    id
                    description
                    collectionEntries {
                      externalId
                      externalTitle
                      externalReleaseDate
                      externalImagePath
                    }
                  }
                `,
                {
                  id,
                  description: input.description,
                  collectionEntries: entriesWithTypename,
                }
              );

              // const CollectionQuery = `
              //   query ($id: ID!) {
              //     collection(id: $id) { id, collectionEntries }
              //   }
              // `;

              // cache.updateQuery(
              //   { query: CollectionQuery, variables: { id, entries } },
              //   (data) => {
              //     if (!data) return null;
              //     console.log("updatequery data", data, entriesWithTypename);
              //     data.collectionEntries = entriesWithTypename;
              //     return data;
              //   }
              // );

              // betterUpdateQuery<UpdateCollectionMutation, CollectionQuery>(
              //   cache,
              //   { query: CollectionDocument },
              //   _result,
              //   (result, query) => ({
              //     collection: {
              //       ...result.updateCollection?.collection,
              //       collectionEntries:
              //         result.updateCollection?.collection?.collectionEntries?.map(
              //           (e) => {
              //             return { ...e, __typename: "CollectionEntry" };
              //           }
              //         ),
              //       __typename: "Collection",
              //     } as any,
              //   })
              // );
            },
            deleteCollection: (_result, args, cache, _info) => {
              cache.invalidate({
                __typename: "Collecton",
                id: (args as DeleteCollectionMutationVariables).id,
              });
              invalidateAll(cache, "userCreatedCollections");
            },
            vote: (_result, args, cache, _info) => {
              const { collectionId } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Collection {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: collectionId } as any
              );
              if (data) {
                // if (data.voteStatus === 1) {
                //   return;
                // }
                const newPoints =
                  (data.points as number) + (data.voteStatus === 1 ? -1 : 1);
                cache.writeFragment(
                  gql`
                    fragment __ on Collection {
                      points
                      voteStatus
                    }
                  `,
                  {
                    id: collectionId,
                    points: newPoints,
                    voteStatus: data.voteStatus === 1 ? 0 : 1,
                  }
                );
              }
            },
            createCollection: (_result, _args, cache, _info) => {
              invalidateAll(cache, "collections");
              invalidateAll(cache, "userCreatedCollections");
            },
            logout: (_result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, _args, cache, _info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
              invalidateAll(cache, "collections");
            },
            register: (_result, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
