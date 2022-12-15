import "reflect-metadata";
import "dotenv-safe/config";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { CollectionResolver } from "./resolvers/collection";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from "cors";
import AppDataSource from "./database/dataSource";
import { createUserLoader } from "./utils/createUserLoader";
import { createLikeLoader } from "./utils/createLikeLoader";
import { createCollectionEntryLoader } from "./utils/createCollectionEntryLoader";
import { CorrectGuessResolver } from "./resolvers/correctGuess";
import { createCorrectGuessLoader } from "./utils/createCorrectGuessLoader";
import { AppealResolver } from "./resolvers/appeal";
import { createCollectionLoader } from "./utils/createCollectionLoader";
import { createSavedCollectionLoader } from "./utils/createSavedCollectionLoader";
import { LeaderboardResolver } from "./resolvers/leaderboard";
import "./tasks";
import { CollectionEntryResolver } from "./resolvers/collectionEntry";
import { createCorrectGuessesByUserLoader } from "./utils/createCorrectGuessesByUserLoader";
import { createCollectionsByUserLoader } from "./utils/createCollectionsByUserLoader";
import { GuessModeCollectionEntryResolver } from "./resolvers/guessModeCollectionEntry";
import { GuessModePlayedResolver } from "./resolvers/guessModePlayed";

const main = async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  // await Collection.delete({}); // deletes all collections
  // await CorrectGuess.delete({}); // deletes all correct guesses

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1);
  // app.set("trust proxy", !__prod__); TODO
  app.use(
    cors({
      credentials: true,
      origin: [
        process.env.CORS_ORIGIN,
        "https://studio.apollographql.com", // use when testing in graphql sandbox,
      ],
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        // sameSite: "none", // for studio
        // secure: true, // for studio
        sameSite: "lax",
        secure: __prod__, // if true, studio works, postman doesn't; if false its the other way around
        domain: __prod__ ? ".thecollectionsgame.com" : undefined,
      },
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CollectionResolver,
        UserResolver,
        CollectionEntryResolver,
        CorrectGuessResolver,
        AppealResolver,
        LeaderboardResolver,
        GuessModeCollectionEntryResolver,
        GuessModePlayedResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      likeLoader: createLikeLoader(),
      collectionEntryLoader: createCollectionEntryLoader(),
      correctGuessLoader: createCorrectGuessLoader(),
      collectionLoader: createCollectionLoader(),
      savedCollectionLoader: createSavedCollectionLoader(),
      correctGuessesByUserLoader: createCorrectGuessesByUserLoader(),
      collectionsByUserLoader: createCollectionsByUserLoader(),
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on port ${process.env.PORT}`);
  });
};

main().catch((error) => {
  console.log(error);
});
