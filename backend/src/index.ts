import "reflect-metadata";
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
import { CorrectGuess } from "./entities/CorrectGuess";
import { createCorrectGuessLoader } from "./utils/createCorrectGuessLoader";
import { AppealResolver } from "./resolvers/appeal";
import { createCollectionLoader } from "./utils/createCollectionLoader";
// import { Collection } from "./entities/Collection";

const main = async () => {
  await AppDataSource.initialize();
  await AppDataSource.runMigrations();

  // await Collection.delete({}); // deletes all collections
  // await CorrectGuess.delete({}); // deletes all correct guesses

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.set("trust proxy", process.env.NODE_ENV !== "production");
  app.use(
    cors({
      credentials: true,
      origin: [
        "https://studio.apollographql.com", // use when testing in graphql sandbox,
        "http://localhost:3000",
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
        sameSite: "none",
        secure: true, // if true, studio works, postman doesn't; if false its the other way around
      },
      secret: "gjfioierq0inverowqklmq[0",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        CollectionResolver,
        UserResolver,
        CorrectGuessResolver,
        AppealResolver,
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
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((error) => {
  console.log(error);
});
