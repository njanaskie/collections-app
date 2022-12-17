import { Leaderboard } from "../entities/Leaderboard";
import { User } from "../entities/User";
import {
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import AppDataSource from "../database/dataSource";
import { verifyAuthHeader } from "../middleware/verifyAuthHeader";

@ObjectType()
class TopUser {
  @Field()
  userId: number;
  @Field()
  stat: number;
  @Field(() => User)
  user: User;
}

@Resolver(Leaderboard)
export class LeaderboardResolver {
  @Query(() => [TopUser])
  async mostCreatedCollectionsUsers(): Promise<TopUser[]> {
    const users = await Leaderboard.find({
      where: { type: "created-collections" },
      relations: ["user"],
      order: { stat: "DESC" },
    });

    return users;
  }

  @Query(() => [TopUser])
  async mostCompletedCollectionsUsers(): Promise<TopUser[]> {
    const users = await Leaderboard.find({
      where: { type: "completed-collections" },
      relations: ["user"],
      order: { stat: "DESC" },
    });

    return users;
  }

  @Query(() => [TopUser])
  async mostGuessesUsers(): Promise<TopUser[]> {
    const users = await Leaderboard.find({
      where: { type: "most-guesses" },
      relations: ["user"],
      order: { stat: "DESC" },
    });

    return users;
  }
  @Query(() => [TopUser])
  async mostVotesUsers(): Promise<TopUser[]> {
    const users = await Leaderboard.find({
      where: { type: "most-votes" },
      relations: ["user"],
      order: { stat: "DESC" },
    });

    return users;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(verifyAuthHeader)
  async insertMostCreatedCollectionsUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
      select pass.* from
      (select c."creatorId" as "userId", count(c.*) as "stat" from collection c
      group by c."creatorId") as pass
      order by pass."stat" desc
      limit 25
      `
    );

    const usersToInsert = users.map((user: User) => {
      return {
        ...user,
        type: "created-collections",
      };
    });

    if (users) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Leaderboard)
        .where("type = :type", { type: "created-collections" })
        .execute();

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Leaderboard)
        .values(usersToInsert)
        .execute();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(verifyAuthHeader)
  async insertMostCompletedCollectionsUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
      select pass3.* from 
      (
        Select pass2."guesserId" as "userId", count(pass2.*) as "stat" from
        (
  
        select cg."collectionId", cg."guesserId", count(cg.*) as cg_count, pass1."count" as ce_count
        from correct_guess cg
        left join (
          Select ce."collectionId", count(ce.*) 
          from collection_entry ce 
          group by ce."collectionId") as pass1 on pass1."collectionId" = cg."collectionId"
        group by cg."collectionId", cg."guesserId",pass1."count"
  
        ) as pass2
        where pass2.cg_count = ce_count
        group by pass2."guesserId"
      ) as pass3
      order by pass3."stat" desc
      limit 25
      `
    );

    const usersToInsert = users.map((user: User) => {
      return {
        ...user,
        type: "completed-collections",
      };
    });

    if (users) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Leaderboard)
        .where("type = :type", { type: "completed-collections" })
        .execute();

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Leaderboard)
        .values(usersToInsert)
        .execute();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(verifyAuthHeader)
  async insertMostGuessesUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
      select pass.* from 
      (select cg."guesserId" as "userId", count(*) as "stat" from correct_guess cg
      group by cg."guesserId"
	    ) as pass
      order by pass."stat" desc
	    limit 25
      `
    );

    const usersToInsert = users.map((user: User) => {
      return {
        ...user,
        type: "most-guesses",
      };
    });

    if (users) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Leaderboard)
        .where("type = :type", { type: "most-guesses" })
        .execute();

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Leaderboard)
        .values(usersToInsert)
        .execute();
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(verifyAuthHeader)
  async insertMostVotesUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
      select pass.* from
      (select c."creatorId" as "userId", sum(c."points") as "stat" from collection c
      group by c."creatorId") as pass
      order by pass."stat" desc
      limit 25
      `
    );

    const usersToInsert = users.map((user: User) => {
      return {
        ...user,
        type: "most-votes",
      };
    });

    if (users) {
      await AppDataSource.createQueryBuilder()
        .delete()
        .from(Leaderboard)
        .where("type = :type", { type: "most-votes" })
        .execute();

      await AppDataSource.createQueryBuilder()
        .insert()
        .into(Leaderboard)
        .values(usersToInsert)
        .execute();
    }

    return true;
  }
}
