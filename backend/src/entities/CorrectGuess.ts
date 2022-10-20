import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";
import { CollectionEntry } from "./CollectionEntry";

@ObjectType()
@Entity()
export class CorrectGuess extends BaseEntity {
  @Field()
  @PrimaryColumn()
  collectionId: number;

  @Field(() => Collection)
  @ManyToOne(() => Collection, (collection) => collection.correctGuesses)
  collection: Collection;

  @Field()
  @PrimaryColumn()
  guesserId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.correctGuesses)
  guesser: User;

  @Field()
  @PrimaryColumn()
  collectionEntryId: number;

  @Field(() => CollectionEntry)
  @ManyToOne(
    () => CollectionEntry,
    (collectionEntry) => collectionEntry.correctGuess
  )
  @JoinColumn()
  collectionEntry: CollectionEntry;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
