import { Collection } from "../entities/Collection";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Int,
  // Field,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
  ObjectType,
  Field,
  // ObjectType,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { CollectionInput } from "./CollectionInput";
// import { validateCreateCollection } from "../utils/validateCreateCollection";
// import { FieldError } from "./FieldError";
import AppDataSource from "../database/dataSource";
import { Like } from "../entities/Like";
import { User } from "../entities/User";
import { CollectionEntry } from "../entities/CollectionEntry";
import { CollectionEntryInput } from "./CollectionEntryInput";
import { In } from "typeorm";

@ObjectType()
class CollectionResponse {
  // @Field(() => [FieldError], { nullable: true })
  // errors?: FieldError[];

  @Field(() => Collection, { nullable: true })
  collection?: Collection;
}

@ObjectType()
class PaginatedCollections {
  @Field(() => [Collection])
  collections: Collection[];
  @Field()
  hasMore: boolean;
}

@Resolver(Collection)
export class CollectionResolver {
  // @FieldResolver()
  // async author(@Root() collection: Collection): Promise<CollectionEntry> {
  //   CollectionEntry.find({ where: { collectionId, userId } });
  //   return await this.userRepository.findOne(recipe.authorId, { cache: 1000 }))!;
  // }

  @FieldResolver(() => String)
  titleSnippet(@Root() collection: Collection) {
    return collection.title.slice(0, 50);
  }

  // field resolvers like this only run if specific fields are included in query
  @FieldResolver(() => User)
  creator(@Root() collection: Collection, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(collection.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() collection: Collection,
    @Ctx() { likeLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return null;
    }

    const like = await likeLoader.load({
      collectionId: collection.id,
      userId: req.session.userId,
    });

    // console.log("votestatus resolver: ", like);
    return like ? 1 : 0;
  }

  @Mutation(() => Boolean)
  async vote(
    @Arg("collectionId", () => Int) collectionId: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    const like = await Like.findOne({ where: { collectionId, userId } });

    // user has voted on the collection before
    if (like) {
      await AppDataSource.transaction(async (tm) => {
        await tm.query(
          `
        delete from public.like
        where "collectionId" = $1 and "userId" = $2
        `,
          [collectionId, userId]
        );

        await tm.query(
          `
        update collection
        set points = points - 1
        where id = $1
        `,
          [collectionId]
        );
      });
    } else if (!like) {
      // has never voted before
      await AppDataSource.transaction(async (tm) => {
        await tm.query(
          `
        insert into public.like ("userId", "collectionId")
        values ($1,$2);
        `,
          [userId, collectionId]
        );

        await tm.query(
          `
        update collection
        set points = points + 1
        where id = $1
        `,
          [collectionId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedCollections)
  async collections(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedCollections> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const collections = await AppDataSource.query(
      `
      select c.*
      from collection c
      ${cursor ? `where c."createdAt" < $2` : ""}
      order by c."createdAt" DESC
      limit $1
      `,
      replacements
    );

    // const qb = AppDataSource.getRepository(Collection)
    //   .createQueryBuilder("c")
    //   .innerJoinAndSelect("c.creator", "u", 'u.id = c."creatorId"')
    //   .orderBy('c."createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('c."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }
    // console.log("all my collections", collections);

    // const collections = await qb.getMany();

    return {
      collections: collections.slice(0, realLimit),
      hasMore: collections.length === realLimitPlusOne,
    };
  }

  // expecting promise to return null, not undefined?
  @Query(() => Collection, { nullable: true })
  async collection(
    @Arg("id", () => Int) id: number
  ): Promise<Collection | null> {
    const collection = await Collection.findOne({
      where: { id },
      relations: ["collectionEntries"],
    });

    console.log("findone collection, ", collection);
    return collection;
  }

  @Mutation(() => CollectionResponse)
  @UseMiddleware(isAuth)
  async createCollection(
    @Arg("input") input: CollectionInput,
    @Arg("entries", () => [CollectionEntryInput])
    entries: CollectionEntryInput[],
    @Ctx() { req }: MyContext
  ): Promise<CollectionResponse> {
    // return Collection.create({
    //   ...input,
    //   creatorId: req.session.userId,
    // }).save();

    // const errors = validateCreateCollection(input);
    // if (errors) {
    //   return { errors };
    // }
    let collection;
    try {
      await AppDataSource.transaction(async (tm) => {
        // const result = await tm
        //   .create(Collection, {
        //     ...input,
        //     creatorId: req.session.userId,
        //   })
        //   .save();
        const result = await tm
          .createQueryBuilder()
          .insert()
          .into(Collection)
          .values({
            ...input,
            creatorId: req.session.userId,
          })
          .returning("*")
          .execute();

        collection = result.raw[0];

        // entries.forEach(async (e) => {
        //   await tm
        //     .create(CollectionEntry, {
        //       ...e,
        //       collectionId: result.raw[0].id,
        //     })
        //     .save();
        // });
        const mappedEntries = entries.map((entry) => {
          return {
            ...entry,
            collectionId: result.raw[0].id,
          };
        });

        await tm
          .createQueryBuilder()
          .insert()
          .into(CollectionEntry)
          .values(mappedEntries)
          .execute();
      });
    } catch (err) {
      console.log("error saving", err);
    }

    return { collection };
  }

  @Mutation(() => CollectionResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async updateCollection(
    @Arg("id", () => Int) id: number,
    @Arg("title") title: string,
    @Arg("entries", () => [CollectionEntryInput])
    entries: CollectionEntryInput[],
    @Ctx()
    { req }: MyContext
  ): Promise<CollectionResponse> {
    // const existingEntries = await CollectionEntry.find({
    //   where: {
    //     collectionId: id,
    //     // externalId: In(entries.map((e) => e.externalId)),
    //   },
    // });
    let collection;
    try {
      await AppDataSource.transaction(async (tm) => {
        const result = await tm
          .createQueryBuilder()
          .update(Collection)
          .set({ title })
          .where('id = :id and "creatorId" = :creatorId', {
            id,
            creatorId: req.session.userId,
          })
          .returning("*")
          .execute();

        collection = result.raw[0];

        const entriesWithCollectionId = entries.map((entry) => {
          return {
            ...entry,
            collectionId: id,
          };
        });
        await tm.save(CollectionEntry, entriesWithCollectionId);

        // entries.forEach(async (entry) => {
        //   if (
        //     !existingEntries.map((e) => e.externalId).includes(entry.externalId)
        //   ) {
        //     await tm
        //       .create(CollectionEntry, {
        //         ...entry,
        //         collectionId: id,
        //       })
        //       .save(); // I think just using save() works if no ID pk
        //   }
        // });

        await tm
          .createQueryBuilder()
          .delete()
          .from(CollectionEntry)
          .where(
            "collectionId = :collectionId and externalId NOT IN (:...ids)",
            {
              collectionId: id,
              ids: entries.map((e) => e.externalId),
            }
          )
          .execute();
      });
    } catch (err) {
      console.log("error saving", err);
    }

    return { collection };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteCollection(
    @Arg("id", () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const collection = await Collection.findOneBy({ id });
    // if (!collection) {
    //   return false;
    // }
    // if (collection.creatorId !== req.session.userId) {
    //   throw new Error("Not authorized");
    // }

    // await Like.delete({ collectionId: id });
    // await Collection.delete({ id });

    await Collection.delete({ id, creatorId: req.session.userId });
    return true;
  }
}
