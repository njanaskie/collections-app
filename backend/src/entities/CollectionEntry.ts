import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";
import { CorrectGuess } from "./CorrectGuess";

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

  @OneToOne(() => CorrectGuess, (correctGuess) => correctGuess.collectionEntry)
  correctGuess: CorrectGuess;

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
}
