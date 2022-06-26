import DataLoader from "dataloader";
import { CorrectGuess } from "../entities/CorrectGuess";

export const createCorrectGuessLoader = () =>
  new DataLoader<
    { collectionId: number; guesserId: number },
    CorrectGuess[] | null
  >(async (keys) => {
    //   console.log("keyssss", keys);
    const correctGuesses = await CorrectGuess.findBy(keys as any);
    // console.log("collectionEntries: ", collectionEntries);
    const guessIdsToGuess: Record<number, CorrectGuess[]> = {};
    correctGuesses.forEach((g) => {
      // entryIdsToEntry[entry.collectionId] = entry;
      if (guessIdsToGuess[g.collectionId]) {
        guessIdsToGuess[g.collectionId].push(g);
      } else {
        guessIdsToGuess[g.collectionId] = [g];
      }
    });
    // console.log("entryIdsToEntry", entryIdsToEntry);
    const map = keys.map((key) => guessIdsToGuess[key.collectionId]);
    // console.log("map", map);

    return map;
    //   return collectionEntries;
  });
