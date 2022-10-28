import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Appeal } from "./Appeal";
import { CollectionEntry } from "./CollectionEntry";
import { CorrectGuess } from "./CorrectGuess";
import { Like } from "./Like";
import { SavedCollection } from "./SavedCollection";
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
  @Generated("uuid")
  @Index()
  reference: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 255 })
  description?: string;

  // @Field(() => [Number])
  // @Column("int", { array: true })
  // items!: number[];

  @Field(() => [CollectionEntry], { nullable: false })
  @OneToMany(
    () => CollectionEntry,
    (collectionEntry) => collectionEntry.collection
    // {
    //   eager: true,
    // }
  )
  collectionEntries: CollectionEntry[];

  @OneToMany(() => CorrectGuess, (correctGuess) => correctGuess.collection)
  correctGuesses: CorrectGuess[];

  @Field(() => [Appeal])
  @OneToMany(() => Appeal, (appeal) => appeal.collection)
  appeals: Appeal[];

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @OneToMany(() => Like, (like) => like.collection)
  likes: Like[];

  @Field(() => Int, { defaultValue: 0 })
  voteStatus: number;

  @Field(() => Number, { defaultValue: 0 })
  guesserCompleteness: number;

  // @Field(() => Int, { defaultValue: 0 })
  // saveStatus: number;

  @OneToMany(
    () => SavedCollection,
    (savedCollection) => savedCollection.collection
  )
  savedCollections: SavedCollection[];

  @Field()
  @Column()
  @Index()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.collections)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
