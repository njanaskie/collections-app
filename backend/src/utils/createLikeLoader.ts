import DataLoader from "dataloader";
import { Like } from "../entities/Like";

export const createLikeLoader = () =>
  new DataLoader<{ collectionId: number; userId: number }, Like | null>(
    async (keys) => {
      //   console.log("keyssss", keys);
      const likes = await Like.findBy(keys as any);
      //   console.log("createlikeloader: ", likes);
      const likeIdsToLike: Record<string, Like> = {};
      likes.forEach((like) => {
        likeIdsToLike[`${like.userId}|${like.collectionId}`] = like;
      });

      return keys.map(
        (key) => likeIdsToLike[`${key.userId}|${key.collectionId}`]
      );
    }
  );
