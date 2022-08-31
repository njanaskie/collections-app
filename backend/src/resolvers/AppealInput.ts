import { InputType, Field } from "type-graphql";
import { CollectionEntryInput } from "./CollectionEntryInput";

@InputType()
export class AppealInput {
  @Field()
  collectionId: number;
  @Field()
  externalEntry: CollectionEntryInput;
}
