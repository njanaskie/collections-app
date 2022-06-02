import { InputType, Field } from "type-graphql";

@InputType()
export class CorrectGuessInput {
  @Field()
  collectionId: number;
  @Field()
  externalId: number;
  @Field()
  pending: boolean;
}
