import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @Field()
  @PrimaryColumn()
  collectionId: number;

  @Field(() => Collection)
  @ManyToOne(() => Collection, (collection) => collection.likes, {
    onDelete: "CASCADE",
  })
  collection: Collection;
}
