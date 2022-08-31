import DataLoader from "dataloader";
import { In } from "typeorm";
import { Collection } from "../entities/Collection";

export const createCollectionLoader = () =>
  new DataLoader<number, Collection>(async (collectionIds) => {
    const collections = await Collection.findBy({
      id: In(collectionIds as number[]),
    });
    const collectionIdToCollection: Record<number, Collection> = {};
    collections.forEach((c) => {
      collectionIdToCollection[c.id] = c;
    });

    return collectionIds.map(
      (collectionId) => collectionIdToCollection[collectionId]
    );
  });
