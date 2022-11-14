import DataLoader from "dataloader";
import { Collection } from "../entities/Collection";

export const createCollectionsByUserLoader = () =>
  new DataLoader<{ creatorId: number }, Collection[] | null>(async (keys) => {
    const collections = await Collection.findBy(keys as any);
    const collectionIdsToCollections: Record<number, Collection[]> = {};
    collections.forEach((c) => {
      if (collectionIdsToCollections[c.creatorId]) {
        collectionIdsToCollections[c.creatorId].push(c);
      } else {
        collectionIdsToCollections[c.creatorId] = [c];
      }
    });
    const map = keys.map((key) => collectionIdsToCollections[key.creatorId]);

    return map;
  });
