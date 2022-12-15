import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GuessModeCollectionEntry } from "./GuessModeCollectionEntry";
import { User } from "./User";

@ObjectType()
@Entity()
export class GuessModePlayed extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  modeId: number;

  @Field(() => GuessModeCollectionEntry)
  @ManyToOne(
    () => GuessModeCollectionEntry,
    (guessModeCollectionEntry) => guessModeCollectionEntry.guessModesPlayed
  )
  mode: GuessModeCollectionEntry;

  @Field()
  @Column()
  optionId: number;

  @Field()
  @Column()
  success: boolean;

  @Field({ nullable: true })
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.guessModesPlayed)
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
