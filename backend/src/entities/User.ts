import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Appeal } from "./Appeal";
import { Collection } from "./Collection";
import { CorrectGuess } from "./CorrectGuess";
import { GuessModePlayed } from "./GuessModePlayed";
import { Like } from "./Like";
import { SavedCollection } from "./SavedCollection";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  // [OptionalProps]?: "createdAt" | "updatedAt";

  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Collection, (collection) => collection.creator)
  collections: Collection[];

  @OneToMany(() => CorrectGuess, (correctGuess) => correctGuess.guesser)
  correctGuesses: CorrectGuess[];

  @OneToMany(() => Appeal, (appeal) => appeal.appealBy)
  appeals: Appeal[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => SavedCollection, (savedCollection) => savedCollection.user)
  savedCollections: SavedCollection[];

  @OneToMany(() => GuessModePlayed, (guessModePlayed) => guessModePlayed.user)
  guessModesPlayed: GuessModePlayed[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  letterboxd_url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  twitter_url: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  website_url: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
