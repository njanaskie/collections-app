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
import { Collection } from "./Collection";
import { CorrectGuess } from "./CorrectGuess";
import { Like } from "./Like";

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

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
