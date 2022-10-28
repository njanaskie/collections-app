import { Field, Mutation, ObjectType, Resolver } from "type-graphql";
import AppDataSource from "../database/dataSource";
import { CollectionEntry } from "../entities/CollectionEntry";
const axios = require("axios");

@ObjectType()
class UpdateResponse {
  @Field()
  total: number;
  @Field()
  updated: number;
  @Field()
  not_updated: number;
}

@Resolver(CollectionEntry)
export class CollectionEntryResolver {
  @Mutation(() => UpdateResponse)
  async updateMissingEntryAttributes(): Promise<UpdateResponse> {
    const entries = await CollectionEntry.find({
      where: [
        { externalTitle: "" },
        { externalImagePath: "" },
        { externalReleaseDate: "" },
      ],
    });

    let resultsUpdated: any[] = [];
    let notUpdated: number = 0;
    const promises = entries.map(async (entry) => {
      // try {
      const res = await axios.get(
        `${process.env.TMDB_BASE_URL}/movie/${entry.externalId}?api_key=${process.env.TMDB_API_KEY}`
      );
      const resultSnippet = {
        externalTitle: res.data.title,
        externalImagePath: res.data.poster_path,
        externalReleaseDate: res.data.release_date,
      };
      if (
        (!entry.externalTitle && !!resultSnippet.externalTitle) ||
        (!entry.externalImagePath && !!resultSnippet.externalImagePath) ||
        (!entry.externalReleaseDate && !!resultSnippet.externalReleaseDate)
      ) {
        await AppDataSource.createQueryBuilder()
          .update(CollectionEntry)
          .set(resultSnippet)
          .where("externalId = :id", { id: entry.externalId })
          .execute();

        resultsUpdated.push(resultSnippet);
      } else {
        notUpdated++;
      }
      return resultsUpdated;
      // } catch (error) {
      //   console.log(error);
      // }
    });

    const promisesToAwait = await Promise.all(promises);

    return {
      total: promisesToAwait.length,
      updated: resultsUpdated.length,
      not_updated: notUpdated,
    };
  }
}
