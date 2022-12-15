import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { GuessModePlayed } from "../entities/GuessModePlayed";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";

@InputType()
export class PlayedInput {
  @Field()
  type: string;
  @Field()
  modeId: number;
  @Field()
  optionId: number;
  @Field()
  success: boolean;
}

@Resolver(GuessModePlayed)
export class GuessModePlayedResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createGuessModePlayed(
    @Arg("input") input: PlayedInput,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    if (input.optionId === -1) return false;

    await GuessModePlayed.create({
      type: "collection-entry",
      modeId: input.modeId,
      optionId: input.optionId,
      success: input.success,
      userId: req.session.userId,
    }).save();

    return true;
  }
}
