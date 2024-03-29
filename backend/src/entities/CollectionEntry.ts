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
import { CorrectGuess } from "./CorrectGuess";
import { GuessModeCollectionEntry } from "./GuessModeCollectionEntry";

@ObjectType()
@Entity()
export class CollectionEntry extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  collectionId: number;

  @Field(() => Collection)
  @ManyToOne(() => Collection, (collection) => collection.collectionEntries, {
    onDelete: "CASCADE",
  })
  collection: Collection;

  @OneToMany(() => CorrectGuess, (correctGuess) => correctGuess.collectionEntry)
  correctGuess: CorrectGuess;

  @OneToMany(
    () => GuessModeCollectionEntry,
    (guessModeCollectionEntry) => guessModeCollectionEntry.collectionEntry
  )
  guessModeCollectionEntries: GuessModeCollectionEntry;

  @Field()
  @Column()
  externalId!: number;

  @Field()
  @Column()
  externalTitle!: string;

  @Field()
  @Column()
  externalImagePath!: string;

  @Field()
  @Column()
  externalReleaseDate!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  // @Field(() => Appeal, { nullable: true })
  // @OneToOne(() => Appeal, (appeal) => appeal.collectionEntry)
  // @JoinColumn()
  // appeal: Appeal;
}
