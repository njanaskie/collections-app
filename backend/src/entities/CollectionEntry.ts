import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";
import { CorrectGuess } from "./CorrectGuess";
import { Appeal } from "./Appeal";

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

  // @Field(() => Appeal, { nullable: true })
  // @OneToOne(() => Appeal, (appeal) => appeal.collectionEntry)
  // @JoinColumn()
  // appeal: Appeal;
}
