import {
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from "urql";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeleteCollectionMutationVariables,
  UpdateCollectionMutationVariables,
  CollectionQuery,
  UpdateCollectionDocument,
  CollectionInput,
  CollectionEntryInput,
  CreateCorrectGuessMutation,
  MyCorrectGuessesQuery,
  MyCorrectGuessesDocument,
  CreateCorrectGuessMutationVariables,
  CorrectGuessInput,
  CorrectGuess,
  CreateCorrectGuessDocument,
  UpdateCollectionMutation,
  CollectionDocument,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import {
  Cache,
  cacheExchange,
  NullArray,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import { pipe, tap } from "wonka";
import Router from "next/router";
import gql from "graphql-tag";
import { isServer } from "./isServer";

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

const simplePagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "collections"
    );
    info.partial = !isInCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "collections") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      const orderBy = fi.arguments!.orderBy;
      // console.log("fieldinfos", data, key);
      // TODO: Decide if this is the best way to do this
      if (orderBy !== fieldArgs.orderBy) {
        // console.log("deleting fi.arguments", fieldArgs.orderBy, fi.arguments);
        cache.invalidate("Query", "collections", fi.arguments);
      } else {
        // console.log(
        //   "not deleteing fi.arguments",
        //   fieldArgs.orderBy,
        //   fi.arguments
        // );
      }

      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PaginatedCollections",
      hasMore,
      collections: results,
    };
  };
};

const invalidateAllCollections = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter(
    (info) => info.fieldName === "collections"
  );
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "collections", fi.arguments);
  });
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }

  return {
    // url: 'https://studio.apollographql.com'
    url: "http://localhost:4000/graphql",
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
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedCollections: () => null,
          CollectionEntry: () => null,
          CorrectGuessResponse: () => null,
          CorrectGuess: () => null,
          UserResponse: () => null,
          RegularUserResponse: () => null,
        },
        resolvers: {
          Query: {
            collections: simplePagination(),
            // userCompletedCollections: simplePagination(),
            // userCreatedCollections: simplePagination(),
            // userStartedCollections: simplePagination(),
            user: (data, args) => {
              return { __typename: "UserResponse", id: args.id };
            },
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
            updateCollection: (_result, args, cache, info) => {
              const { entries, id } = args as UpdateCollectionMutationVariables;
              const entriesArray = <CollectionEntryInput[]>entries;
              const entriesWithTypename = entriesArray.map((e) => {
                return { ...e, __typename: "CollectionEntry" };
              });

              cache.writeFragment(
                gql`
                  fragment __ on Collection {
                    id
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
            deleteCollection: (_result, args, cache, info) => {
              cache.invalidate({
                __typename: "Collecton",
                id: (args as DeleteCollectionMutationVariables).id,
              });
            },
            vote: (_result, args, cache, info) => {
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
            createCollection: (_result, args, cache, info) => {
              invalidateAllCollections(cache);
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },
            login: (_result, args, cache, info) => {
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
              invalidateAllCollections(cache);
            },
            register: (_result, args, cache, info) => {
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
