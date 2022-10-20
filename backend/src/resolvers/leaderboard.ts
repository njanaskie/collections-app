import { Leaderboard } from "../entities/Leaderboard";
import { User } from "../entities/User";
import { Field, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import AppDataSource from "../database/dataSource";

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
  async insertMostGuessesUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
      select pass.*, u."username" from 
      (select cg."guesserId" as "userId", count(*) as "stat" from correct_guess cg
      group by cg."guesserId"
      limit 25) as pass
      left join "user" u on u.id = pass."userId"
      order by pass."stat" desc
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
  async insertMostVotesUsers(): Promise<Boolean> {
    const users = await AppDataSource.query(
      `
        select pass2.*, u."username" from
        (select pass."creatorId" as "userId", count(*) as "stat" from
        (select c."creatorId", c."points" from collection c
        group by c."creatorId", c."points") as pass
        group by pass."creatorId"
        limit 25
        ) as pass2
        left join "user" u on u.id = pass2."userId"
        order by pass2."stat" desc
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
