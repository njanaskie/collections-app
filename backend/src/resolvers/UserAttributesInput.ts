import { InputType, Field } from "type-graphql";

@InputType()
export class UserAttributesInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  letterboxd_url: string;

  @Field({ nullable: true })
  twitter_url: string;

  @Field({ nullable: true })
  website_url: string;
}
