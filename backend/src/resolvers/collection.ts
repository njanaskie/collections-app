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
import { validateCreateCollection } from "../utils/validateCreateCollection";
// import { FieldError } from "./FieldError";
import AppDataSource from "../database/dataSource";
import { Like } from "../entities/Like";
import { User } from "../entities/User";
import { CollectionEntry } from "../entities/CollectionEntry";
import { CollectionEntryInput } from "./CollectionEntryInput";
import { CorrectGuess } from "../entities/CorrectGuess";
import { PRIME_NUMBERS } from "../constants";
import { FieldError } from "./FieldError";

@ObjectType()
class CollectionResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Collection, { nullable: true })
  collection?: Collection;
}

@ObjectType()
class PaginatedCollections {
  @Field(() => [Collection])
  collections: Collection[];
  @Field()
  hasMore: boolean;
  @Field({ nullable: true })
  modulus?: number;
}

@Resolver(Collection)
export class CollectionResolver {
  // @FieldResolver()
  // async author(@Root() collection: Collection): Promise<CollectionEntry> {
  //   CollectionEntry.find({ where: { collectionId, userId } });
  //   return await this.userRepository.findOne(recipe.authorId, { cache: 1000 }))!;
  // }

  @Query(() => PaginatedCollections)
  async userCompletedCollections(
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("page", () => Int) page: number,
    @Ctx()
    { req }: MyContext
  ): Promise<PaginatedCollections> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    const collections = await AppDataSource.query(
      `
      Select * From (
        Select 
        c.*,
        (Select count(ce.*) from collection_entry ce
        where ce."collectionId" = c.id
        group by c.id) as ce_count,
        (Select count(cg.*) from correct_guess cg
        where cg."collectionId" = c.id and cg."guesserId" = ${userId}
        group by c.id) as cg_count
        From collection c
      ) as counts
      where counts.ce_count = counts.cg_count
      order by counts."createdAt" DESC
      limit ${realLimitPlusOne}
      offset ${offset}
      `
    );

    return {
      collections: collections.slice(0, realLimit),
      hasMore: collections.length === realLimitPlusOne,
    };
  }

  @Query(() => PaginatedCollections)
  async userStartedCollections(
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("page", () => Int) page: number,
    @Ctx()
    { req }: MyContext
  ): Promise<PaginatedCollections> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    const collections = await AppDataSource.query(
      `
      Select * From (
        Select 
        c.*,
        (Select count(ce.*) from collection_entry ce
        where ce."collectionId" = c.id
        group by c.id) as ce_count,
        (Select count(cg.*) from correct_guess cg
        where cg."collectionId" = c.id and cg."guesserId" = ${userId}
        group by c.id) as cg_count
        From collection c
      ) as counts
      where counts.ce_count != counts.cg_count and cg_count > 0
      order by counts."createdAt" DESC
      limit ${realLimitPlusOne}
      offset ${offset}
      `
    );

    return {
      collections: collections.slice(0, realLimit),
      hasMore: collections.length === realLimitPlusOne,
    };
  }

  @Query(() => PaginatedCollections)
  async userCreatedCollections(
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("page", () => Int) page: number,
    @Ctx()
    { req }: MyContext
  ): Promise<PaginatedCollections> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    // const collections = await AppDataSource.query(
    //   `
    //   select c.*
    //   from collection c
    //   where c."creatorId" = ${userId}
    //   order by c."createdAt" DESC
    //   limit ${realLimitPlusOne}
    //   offset ${offset}
    //   `
    // );

    const collections = await AppDataSource.getRepository(Collection)
      .createQueryBuilder("c")
      .where('c."creatorId" = :userId', { userId })
      .orderBy('c."createdAt"', "DESC")
      .skip(offset)
      .take(realLimitPlusOne)
      .getMany();

    return {
      collections: collections.slice(0, realLimit),
      hasMore: collections.length === realLimitPlusOne,
    };
  }

  @FieldResolver(() => Number)
  async guesserCompleteness(
    @Root() collection: Collection,
    @Ctx() { correctGuessLoader, collectionEntryLoader, req }: MyContext
  ) {
    if (!req.session.userId) {
      return 0;
    }

    const loadedCorrectGuesses = await correctGuessLoader.load({
      collectionId: collection.id,
      guesserId: req.session.userId,
    });

    const loadedCollectionEntries = await collectionEntryLoader.load({
      collectionId: collection.id,
    });

    if (!loadedCollectionEntries) {
      return 0;
    }

    const correctGuessesLength = loadedCorrectGuesses
      ? loadedCorrectGuesses.length
      : 0;

    return parseFloat(
      (correctGuessesLength / loadedCollectionEntries.length).toFixed(2)
    );
  }

  @FieldResolver(() => String, { nullable: true })
  titleSnippet(@Root() collection: Collection) {
    return collection.title.slice(0, 150);
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
    @Arg("modulus", () => Int, { nullable: true }) modulus: number | null,
    @Arg("orderBy", () => String, { nullable: true }) orderBy: string | null,
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Arg("page", () => Int) page: number,
    @Ctx()
    { req }: MyContext
  ): Promise<PaginatedCollections> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const realModulus = modulus
      ? modulus
      : PRIME_NUMBERS[Math.floor(Math.random() * PRIME_NUMBERS.length)];
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    let orderParam = 'c."createdAt" DESC';
    if (orderBy === "new") {
      orderParam;
    } else if (orderBy === "popular") {
      // orderParam = 'c.points DESC, c."createdAt" DESC';
      orderParam = "c.points DESC";
    } else if (orderBy === "random") {
      orderParam = `CAST(extract(epoch from c."createdAt") as integer) % ${realModulus}, id DESC`;
    }

    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    // const collections = await AppDataSource.query(
    //   `
    //   select c.*
    //   from collection c
    //   ${cursor ? `where c."createdAt" < $2` : ""}
    //   order by ${orderParam}
    //   limit $1
    //   `,
    //   replacements
    // );

    const collections = await AppDataSource.query(
      `
      select c.*
      from collection c
      ${
        req.session.userId ? `where c."creatorId" != ${req.session.userId}` : ""
      }
      order by ${orderParam}
      limit $1
      offset ${offset}
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
      modulus: realModulus,
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

    const errors = validateCreateCollection(input, entries);
    if (errors) {
      return { errors };
    }
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
    const existingEntries = await CollectionEntry.find({
      where: {
        collectionId: id,
        // externalId: In(entries.map((e) => e.externalId)),
      },
    });
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
        console.log("entriesWithCollectionId", entriesWithCollectionId);
        // await tm.save(CollectionEntry, entriesWithCollectionId);

        entriesWithCollectionId.forEach(async (entry) => {
          if (
            !existingEntries.map((e) => e.externalId).includes(entry.externalId)
          ) {
            // await tm
            //   .create(CollectionEntry, {
            //     ...entry,
            //     collectionId: id,
            //   })
            //   .save(); // I think just using save() works if no ID pk
            await tm.save(CollectionEntry, entry);
          }
        });

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
