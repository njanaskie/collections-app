import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Collection } from "./Collection";
import { CorrectGuess } from "./CorrectGuess";
import { CollectionEntry } from "./CollectionEntry";

@ObjectType()
@Entity()
export class Appeal extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  state: string;

  @Field()
  @Column()
  collectionId: number;

  @Field(() => Collection)
  @ManyToOne(() => Collection, (collection) => collection.appeals, {
    onDelete: "CASCADE",
  })
  collection: Collection;

  //   @Field(() => Int, { nullable: true })
  //   @Column()
  //   collectionEntryId?: number;

  //   @Field(() => CollectionEntry, { nullable: true })
  //   @OneToOne(() => CollectionEntry, (collectionEntry) => collectionEntry.appeal)
  //   collectionEntry: CollectionEntry;

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

  @Field()
  @Column()
  appealById: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.appeals)
  appealBy: User;

  @Field(() => Number, { defaultValue: 1 })
  appealCount: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
