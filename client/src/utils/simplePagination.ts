import { Resolver } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

export const simplePagination = (
  selectFieldName: string,
  type: string
): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      type
    );
    info.partial = !isInCache;
    let hasMore = true;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, type) as string[];

      // TODO: Decide if this is the best way to do this
      const orderBy = fi.arguments!.orderBy ? fi.arguments!.orderBy : undefined;
      if (orderBy && orderBy !== fieldArgs.orderBy) {
        cache.invalidate("Query", type, fi.arguments);
      }

      // TODO: Decide if this is the best way to do this
      const appealState = fi.arguments!.state ? fi.arguments!.state : undefined;
      if (appealState && appealState !== fieldArgs.state) {
        cache.invalidate("Query", selectFieldName, fi.arguments);
      }

      const userId = fi.arguments!.userId ? fi.arguments!.userId : undefined;
      if (userId && userId !== fieldArgs.userId) {
        cache.invalidate("Query", selectFieldName, fi.arguments);
      }

      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) {
        hasMore = _hasMore as boolean;
      }

      if (data) {
        results.push(...data);
      }
    });

    return {
      __typename: `Paginated${type.charAt(0).toUpperCase() + type.slice(1)}`,
      hasMore,
      [type]: results,
    };
  };
};
