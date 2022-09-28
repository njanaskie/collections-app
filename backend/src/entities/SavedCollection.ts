import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";

@ObjectType()
@Entity()
export class SavedCollection extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.savedCollections)
  user: User;

  @Field()
  @PrimaryColumn()
  collectionId: number;

  @Field(() => Collection)
  @ManyToOne(() => Collection, (collection) => collection.savedCollections, {
    onDelete: "CASCADE",
  })
  collection: Collection;
}
