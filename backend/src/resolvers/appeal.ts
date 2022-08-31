import {
  Resolver,
  Mutation,
  Ctx,
  UseMiddleware,
  Arg,
  Field,
  ObjectType,
  Query,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../middleware/isAuth";
import { CorrectGuess } from "../entities/CorrectGuess";
import { CorrectGuessInput } from "./CorrectGuessInput";
import { FieldError } from "./FieldError";
import { CollectionEntry } from "../entities/CollectionEntry";
import { Appeal } from "../entities/Appeal";
import { AppealInput } from "./AppealInput";
import AppDataSource from "../database/dataSource";
import { In, Not } from "typeorm";
import { Collection } from "../entities/Collection";
import { CollectionEntryInput } from "./CollectionEntryInput";

@ObjectType()
class AppealResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Appeal, { nullable: true })
  appeal?: Appeal;
}

@ObjectType()
class PaginatedAppeals {
  @Field(() => [Appeal])
  appeals: Appeal[];
  @Field()
  hasMore: boolean;
}

@ObjectType()
class PaginatedAppealsReviewable {
  @Field(() => [Appeal])
  appeals: AppealReviewable[];
  @Field()
  hasMore: boolean;
}

type AppealReviewable = {
  collectionId: number;
  externalId: number;
  externalTitle: string;
  externalImagePath: string;
  externalReleaseDate: string;
  appealCount: number;
};

@Resolver(Appeal)
export class AppealResolver {
  @FieldResolver(() => Collection)
  collection(@Root() appeal: Appeal, @Ctx() { collectionLoader }: MyContext) {
    return collectionLoader.load(appeal.collectionId);
  }

  @Query(() => PaginatedAppeals)
  @UseMiddleware(isAuth)
  async appealsSubmitted(
    @Arg("state", () => String, { nullable: true }) state: string,
    @Arg("limit", () => Int) limit: number,
    @Arg("page", () => Int) page: number,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedAppeals> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    if (!req.session.userId) {
      return {
        appeals: [],
        hasMore: false,
      };
    }
    const replacements: any[] = [];

    if (state) {
      replacements.push(state);
    }

    const appealsSubmitted = await AppDataSource.query(
      `
      select a.*
      from appeal a
      where a."appealById" = ${req.session.userId}
      ${state ? `and a.state = $1` : ""}
      order by a."createdAt" DESC
      limit ${realLimitPlusOne}
      offset ${offset}
      `,
      replacements
    );

    return {
      appeals: appealsSubmitted,
      hasMore: appealsSubmitted.length === realLimitPlusOne,
    };
  }

  @Query(() => PaginatedAppeals)
  @UseMiddleware(isAuth)
  async appealsReviewable(
    @Arg("limit", () => Int) limit: number,
    @Arg("page", () => Int) page: number,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedAppeals> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    const offset = page === 1 ? 0 : page * realLimit - realLimit;

    if (!req.session.userId) {
      return {
        appeals: [],
        hasMore: false,
      };
    }

    const appealsReviewable = await AppDataSource.query(
      `
      select
        a."collectionId",
        a."externalId",
        a."externalTitle",
        a."externalImagePath",
        a."externalReleaseDate",
        count(a."appealById") as "appealCount"
      from appeal a
      where a."collectionId" in (Select c.id From collection c where c."creatorId" = ${req.session.userId})
      and a.state = 'pending'
      group by
        a."collectionId",
        a."externalId",
        a."externalTitle",
        a."externalImagePath",
        a."externalReleaseDate"
      order by a."collectionId", max(a."createdAt") DESC
      limit ${realLimitPlusOne}
      offset ${offset}
      `
    );

    return {
      appeals: appealsReviewable,
      hasMore: appealsReviewable.length === realLimitPlusOne,
    };
  }

  @Mutation(() => AppealResponse)
  @UseMiddleware(isAuth)
  async createAppeal(
    @Arg("appeal") appeal: AppealInput,
    @Ctx() { req }: MyContext
  ): Promise<AppealResponse> {
    // const errors = validateRegister(options);
    // if (errors) {
    //   return { errors };
    // }

    let appealToCreate;
    const result = await Appeal.create({
      collectionId: appeal.collectionId,
      externalId: appeal.externalEntry.externalId,
      externalTitle: appeal.externalEntry.externalTitle,
      externalImagePath: appeal.externalEntry.externalImagePath,
      externalReleaseDate: appeal.externalEntry.externalReleaseDate,
      appealById: req.session.userId,
      state: "pending",
    }).save();

    appealToCreate = result;

    return { appeal: appealToCreate };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async approveAppeal(
    @Arg("externalEntry") externalEntry: CollectionEntryInput,
    @Arg("collectionId", () => Int) collectionId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const appealsToUpdate = await Appeal.findBy({
      externalId: externalEntry.externalId,
      collectionId,
    });

    // TODO: decide if want to keep primary ID column, if not then do not need existing entries check
    const existingEntry = await CollectionEntry.findOneBy({
      collectionId,
      externalId: externalEntry.externalId,
    });

    if (appealsToUpdate && !existingEntry) {
      try {
        await AppDataSource.transaction(async (tm) => {
          const collectionEntryResult = await tm
            .createQueryBuilder()
            .insert()
            .into(CollectionEntry)
            .values({
              collectionId,
              externalId: externalEntry.externalId,
              externalTitle: externalEntry.externalTitle,
              externalImagePath: externalEntry.externalImagePath,
              externalReleaseDate: externalEntry.externalReleaseDate,
            })
            .returning("*")
            .execute();

          let collectionEntryToCreate = collectionEntryResult.raw[0];

          await tm
            .createQueryBuilder()
            .update(Appeal)
            .set({
              state: "approved",
            })
            .where({ id: In(appealsToUpdate.map((a) => a.id)) })
            .execute();

          let mappedAppeals = appealsToUpdate.map((appeal) => {
            return {
              collectionId: appeal.collectionId,
              guesserId: appeal.appealById,
              collectionEntryId: collectionEntryToCreate.id,
            };
          });
          await tm
            .createQueryBuilder()
            .insert()
            .into(CorrectGuess)
            .values(mappedAppeals)
            .returning("*")
            .execute();
        });
      } catch (err) {
        console.log("error saving", err);
      }
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async rejectAppeal(
    @Arg("externalId", () => Int) externalId: number,
    @Arg("collectionId", () => Int) collectionId: number,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    const appealsToUpdate = await Appeal.find({
      select: {
        id: true,
      },
      where: {
        externalId,
        collectionId,
      },
    });

    await AppDataSource.createQueryBuilder()
      .update(Appeal)
      .set({
        state: "rejected",
      })
      .where({ id: In(appealsToUpdate.map((e) => e.id)) })
      .execute();

    return true;
  }
}
