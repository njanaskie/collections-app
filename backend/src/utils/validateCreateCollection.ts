import { CollectionEntryInput } from "../resolvers/CollectionEntryInput";
import { CollectionInput } from "../resolvers/CollectionInput";

function isArrayOfNums(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

export const validateCreateCollection = (
  input: CollectionInput,
  entries: CollectionEntryInput[]
) => {
  if (!input.title || input.title === "") {
    return [
      {
        field: "title",
        message: "Must have a title",
      },
    ];
  }

  if (typeof input.title !== "string") {
    return [
      {
        field: "title",
        message: "Must be a string",
      },
    ];
  }

  if (entries.length < 1) {
    return [
      {
        field: "entries",
        message: "Must have at least one entry",
      },
    ];
  }

  // entries.map((entry) => {
  //   if (
  //     typeof entry.externalId !== "number" ||
  //     typeof entry.externalImagePath !== "string" ||
  //     typeof entry.externalReleaseDate !== "string" ||
  //     typeof entry.externalTitle !== "string"
  //   ) {
  //     return [
  //       {
  //         field: "entries",
  //         message: "There was an issue with the entry data",
  //       },
  //     ];
  //   }

  //   return null;
  // });

  return null;
};
