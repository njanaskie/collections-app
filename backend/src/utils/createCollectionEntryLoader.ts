import DataLoader from "dataloader";
import { CollectionEntry } from "../entities/CollectionEntry";

export const createCollectionEntryLoader = () =>
  new DataLoader<{ collectionId: number }, CollectionEntry[] | null>(
    async (keys) => {
      const collectionEntries = await CollectionEntry.findBy(keys as any);
      const entryIdsToEntry: Record<number, CollectionEntry[]> = {};
      collectionEntries.forEach((entry) => {
        if (entryIdsToEntry[entry.collectionId]) {
          entryIdsToEntry[entry.collectionId].push(entry);
        } else {
          entryIdsToEntry[entry.collectionId] = [entry];
        }
      });
      const map = keys.map((key) => entryIdsToEntry[key.collectionId]);

      return map;
    }
  );
