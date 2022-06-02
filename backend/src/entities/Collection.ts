import { Field, Int, ObjectType } from "type-graphql";
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
import { CollectionEntry } from "./CollectionEntry";
import { CorrectGuess } from "./CorrectGuess";
import { Like } from "./Like";
import { User } from "./User";

@ObjectType()
@Entity()
export class Collection extends BaseEntity {
  // [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  // @Field(() => [Number])
  // @Column("int", { array: true })
  // items!: number[];

  @Field(() => [CollectionEntry], { nullable: true })
  @OneToMany(
    () => CollectionEntry,
    (collectionEntry) => collectionEntry.collection
  )
  collectionEntries: CollectionEntry[];

  @OneToMany(() => CorrectGuess, (correctGuess) => correctGuess.collection)
  correctGuesses: CorrectGuess[];

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @OneToMany(() => Like, (like) => like.collection)
  likes: Like[];

  @Field(() => Int, { defaultValue: 0 })
  voteStatus: number;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.collections)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
