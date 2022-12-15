import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Collection } from "./Collection";
import { CollectionEntry } from "./CollectionEntry";
import { GuessModePlayed } from "./GuessModePlayed";

@ObjectType()
@Entity()
export class GuessModeCollectionEntry extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  collectionEntryId: number;

  @Field(() => CollectionEntry)
  @ManyToOne(
    () => CollectionEntry,
    (collectionEntry) => collectionEntry.guessModeCollectionEntries
  )
  collectionEntry: CollectionEntry;

  @Field()
  @Column()
  correctCollectionId: number;

  @Field()
  @Column()
  firstIncorrectCollectionId: number;

  @Field()
  @Column()
  secondIncorrectCollectionId: number;

  @Field()
  @Column()
  thirdIncorrectCollectionId: number;

  @Field(() => Collection)
  @ManyToOne(
    () => Collection,
    (correctCollection) => correctCollection.correctCollections
  )
  correctCollection: Collection;

  @Field(() => Collection)
  @ManyToOne(
    () => Collection,
    (firstIncorrectCollection) =>
      firstIncorrectCollection.firstIncorrectCollections
  )
  firstIncorrectCollection: Collection;

  @Field(() => Collection)
  @ManyToOne(
    () => Collection,
    (secondIncorrectCollection) =>
      secondIncorrectCollection.secondIncorrectCollections
  )
  secondIncorrectCollection: Collection;

  @Field(() => Collection)
  @ManyToOne(
    () => Collection,
    (thirdIncorrectCollection) =>
      thirdIncorrectCollection.thirdIncorrectCollections
  )
  thirdIncorrectCollection: Collection;

  @Field(() => GuessModePlayed, { nullable: true })
  @OneToMany(() => GuessModePlayed, (guessModePlayed) => guessModePlayed.mode)
  guessModesPlayed: GuessModePlayed[];

  @Field(() => [Number])
  @Column("int", { array: true })
  optionsOrder: Number[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
