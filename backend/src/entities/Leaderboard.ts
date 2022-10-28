import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Leaderboard extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.savedCollections)
  user: User;

  @Field()
  @PrimaryColumn()
  stat!: number;

  @Field()
  @PrimaryColumn()
  type!: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
