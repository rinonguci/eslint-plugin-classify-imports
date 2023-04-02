import { OptionsInput } from "../types/common.type";

export const formatOptions = (options: OptionsInput) => {
  return {
    ...options,
    importOrder: options.importOrder.map((item) => {
      return item.split("--comment").map((item) => item.trim());
    }),
  };
};
