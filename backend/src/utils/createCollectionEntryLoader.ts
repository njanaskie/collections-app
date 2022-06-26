import DataLoader from "dataloader";
import { CollectionEntry } from "../entities/CollectionEntry";
import { Collection } from "../entities/Collection";

export const createCollectionEntryLoader = () =>
  new DataLoader<{ collectionId: number }, CollectionEntry[] | null>(
    async (keys) => {
      //   console.log("keyssss", keys);
      const collectionEntries = await CollectionEntry.findBy(keys as any);
      // console.log("collectionEntries: ", collectionEntries);
      const entryIdsToEntry: Record<number, CollectionEntry[]> = {};
      collectionEntries.forEach((entry) => {
        // entryIdsToEntry[entry.collectionId] = entry;
        if (entryIdsToEntry[entry.collectionId]) {
          entryIdsToEntry[entry.collectionId].push(entry);
        } else {
          entryIdsToEntry[entry.collectionId] = [entry];
        }
      });
      // console.log("entryIdsToEntry", entryIdsToEntry);
      const map = keys.map((key) => entryIdsToEntry[key.collectionId]);
      // console.log("map", map);

      return map;
      //   return collectionEntries;
    }
  );

// export const createCollectionEntryLoader = () =>
//   new DataLoader<{ id: number }, Collection | null>(async (keys) => {
//     // console.log("keyssss", keys);
//     const collections = await Collection.findBy(keys as any);
//     // const collections = await Collection.find({
//     //   where: keys as any,
//     //   relations: ["collectionEntries"],
//     // });
//     const collectionIdsToCollection: Record<number, Collection> = {};
//     collections.forEach((c) => {
//       collectionIdsToCollection[c.id] = c;
//     });

//     return keys.map((key) => collectionIdsToCollection[key.id]);
//     //   return collectionEntries;
//   });
