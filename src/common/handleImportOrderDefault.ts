import { Options } from "../types/common.type";

export const getImportOrder = (options: Options) => {
  if (options.importOrder) {
    return options.importOrder.map((value) =>
      Array.isArray(value) ? value[0] : value
    );
  }
  return [];
};
