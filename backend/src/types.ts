import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import { createCollectionEntryLoader } from "./utils/createCollectionEntryLoader";
import { createCollectionLoader } from "./utils/createCollectionLoader";
import { createCorrectGuessLoader } from "./utils/createCorrectGuessLoader";
import { createLikeLoader } from "./utils/createLikeLoader";
import { createSavedCollectionLoader } from "./utils/createSavedCollectionLoader";
import { createUserLoader } from "./utils/createUserLoader";

export type MyContext = {
  req: Request & { session?: Session & { userId?: number } };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
  collectionEntryLoader: ReturnType<typeof createCollectionEntryLoader>;
  correctGuessLoader: ReturnType<typeof createCorrectGuessLoader>;
  collectionLoader: ReturnType<typeof createCollectionLoader>;
  savedCollectionLoader: ReturnType<typeof createSavedCollectionLoader>;
};
