import {
  Resolver,
  Mutation,
  Ctx,
  UseMiddleware,
  Arg,
  Field,
  ObjectType,
  Query,
  Int,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { CorrectGuess } from "../entities/CorrectGuess";
import { CorrectGuessInput } from "./CorrectGuessInput";
import { FieldError } from "./FieldError";
import { CollectionEntry } from "../entities/CollectionEntry";

@ObjectType()
class CorrectGuessResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => CorrectGuess, { nullable: true })
  correctGuess?: CorrectGuess;
}

@Resolver(CorrectGuess)
export class CorrectGuessResolver {
  @Query(() => [CorrectGuess], { nullable: true })
  async myCorrectGuesses(
    @Arg("collectionId", () => Int) collectionId: number,
    @Ctx() { req }: MyContext
  ): Promise<CorrectGuess[]> {
    if (!req.session.userId) {
      return [];
    }

    const correctGuesses = await CorrectGuess.find({
      where: {
        collectionId,
        guesserId: req.session.userId,
      },
      relations: ["collectionEntry"],
    });

    return correctGuesses;
  }

  @Mutation(() => CorrectGuessResponse)
  @UseMiddleware(isAuth)
  async createCorrectGuess(
    @Arg("guess") guess: CorrectGuessInput,
    @Ctx() { req }: MyContext
  ): Promise<CorrectGuessResponse> {
    // const errors = validateRegister(options);
    // if (errors) {
    //   return { errors };
    // }
    const collectionEntry = await CollectionEntry.findOneBy({
      collectionId: guess.collectionId,
      externalId: guess.externalId,
    });

    if (!collectionEntry) {
      return {
        errors: [
          {
            field: "correctGuess",
            message: "Collection entry not found.",
          },
        ],
      };
    }

    let correctGuess;
    const result = await CorrectGuess.create({
      collectionId: guess.collectionId,
      collectionEntryId: collectionEntry.id,
      guesserId: req.session.userId,
      pending: guess.pending,
    }).save();

    correctGuess = result;

    return { correctGuess };
  }
}
