import { GUESS_MODE_COLLECTION_ENTRY_COUNT } from "../constants";
import {
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import AppDataSource from "../database/dataSource";
import { GuessModeCollectionEntry } from "../entities/GuessModeCollectionEntry";
import { GuessModePlayed } from "../entities/GuessModePlayed";
import { MyContext } from "../types";
import { verifyAuthHeader } from "../middleware/verifyAuthHeader";

@Resolver(GuessModeCollectionEntry)
export class GuessModeCollectionEntryResolver {
  @FieldResolver(() => GuessModePlayed, { nullable: true })
  async guessModePlayed(
    @Root() guessModeCollectionEntry: GuessModeCollectionEntry,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const guessModePlayed = await GuessModePlayed.findOne({
      where: {
        modeId: guessModeCollectionEntry.id,
        userId: req.session.userId,
      },
    });

    return guessModePlayed;
  }

  @Query(() => [GuessModeCollectionEntry])
  async guessModeCollectionEntries(): Promise<GuessModeCollectionEntry[]> {
    const guessModeEntries = await GuessModeCollectionEntry.find({
      relations: {
        collectionEntry: true,
        correctCollection: true,
        firstIncorrectCollection: true,
        secondIncorrectCollection: true,
        thirdIncorrectCollection: true,
      },
      order: {
        id: "DESC",
      },
      take: GUESS_MODE_COLLECTION_ENTRY_COUNT,
    });

    return guessModeEntries;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(verifyAuthHeader)
  async insertGuessModeCollectionEntry(): Promise<Boolean> {
    const queryRandomEntry = async () => {
      const [randomSelection] = await AppDataSource.query(
        `
        SELECT ce.id as "randomEntry", ce."collectionId" as "correctAnswer" FROM collection_entry ce
        OFFSET floor(random() * (select count(*) from collection_entry))
        LIMIT 1;
        `
      );

      return randomSelection;
    };

    // return randomSelection if it doesn't exist in guess_mode_collection_entry otherwise retry 3 times
    const getRandomEntry = async () => {
      let randomSelection = await queryRandomEntry();
      let count = 0;
      while (count < 3) {
        const existingEntry = await GuessModeCollectionEntry.find({
          where: {
            collectionEntryId: randomSelection.randomEntry,
          },
        });
        if (existingEntry.length > 0) {
          randomSelection = await queryRandomEntry();
          count++;
        } else {
          return randomSelection;
        }
      }
      return null;
    };

    const randomEntryResult = await getRandomEntry();

    if (!randomEntryResult) {
      return false;
    }

    const incorrectCollectionOptions = await AppDataSource.query(
      `
        SELECT c.id FROM collection c
        WHERE c.id != ${randomEntryResult.correctAnswer}
        ORDER BY random()
        LIMIT 3
        `
    );

    let indexList = [0, 1, 2, 3];
    for (let i = indexList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexList[i], indexList[j]] = [indexList[j], indexList[i]];
    }

    const dataToInsert = {
      collectionEntryId: randomEntryResult.randomEntry,
      correctCollectionId: randomEntryResult.correctAnswer,
      firstIncorrectCollectionId: incorrectCollectionOptions[0].id,
      secondIncorrectCollectionId: incorrectCollectionOptions[1].id,
      thirdIncorrectCollectionId: incorrectCollectionOptions[2].id,
      optionsOrder: indexList,
    };

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(GuessModeCollectionEntry)
      .values(dataToInsert)
      .execute();

    return true;
  }
}
