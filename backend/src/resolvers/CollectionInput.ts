import { InputType, Field } from "type-graphql";

@InputType()
export class CollectionInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description: string;

  // @Field(() => [Number])
  // items: number[];
}
