import { CollectionInput } from "src/resolvers/CollectionInput";

function isArrayOfNums(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

export const validateCreateCollection = (input: CollectionInput) => {
  if (!isArrayOfNums(input.items)) {
    return [
      {
        field: "items",
        message: "Invalid input",
      },
    ];
  }

  if (typeof input.items === "string") {
    return [
      {
        field: "items",
        message: "Cannot be a string",
      },
    ];
  }

  if (input.items.length < 1) {
    return [
      {
        field: "items",
        message: "Must have at least one item",
      },
    ];
  }

  return null;
};
