import DataLoader from "dataloader";
import { SavedCollection } from "../entities/SavedCollection";

export const createSavedCollectionLoader = () =>
  new DataLoader<
    { collectionId: number; userId: number },
    SavedCollection | null
  >(async (keys) => {
    const savedCollections = await SavedCollection.findBy(keys as any);
    const savedIdsToSaved: Record<string, SavedCollection> = {};
    savedCollections.forEach((saved) => {
      savedIdsToSaved[`${saved.userId}|${saved.collectionId}`] = saved;
    });

    return keys.map(
      (key) => savedIdsToSaved[`${key.userId}|${key.collectionId}`]
    );
  });
