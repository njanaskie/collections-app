import DataLoader from "dataloader";
import { CorrectGuess } from "../entities/CorrectGuess";

export const createCorrectGuessesByUserLoader = () =>
  new DataLoader<{ guesserId: number }, CorrectGuess[] | null>(async (keys) => {
    const correctGuesses = await CorrectGuess.findBy(keys as any);
    const guessIdsToGuess: Record<number, CorrectGuess[]> = {};
    correctGuesses.forEach((g) => {
      if (guessIdsToGuess[g.guesserId]) {
        guessIdsToGuess[g.guesserId].push(g);
      } else {
        guessIdsToGuess[g.guesserId] = [g];
      }
    });
    const map = keys.map((key) => guessIdsToGuess[key.guesserId]);

    return map;
  });
