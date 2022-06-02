import { InputType, Field } from "type-graphql";

@InputType()
export class CollectionEntryInput {
  @Field()
  externalId: number;

  @Field()
  externalTitle: string;

  @Field()
  externalImagePath: string;

  @Field()
  externalReleaseDate: string;
}
