import { DEFAULT_IMPORT } from "../constant";
import { Options } from "../types/common.type";

const insertModule = (insertedModule: string, imports: string[]) => {
  if (imports.includes(insertedModule)) {
    return;
  }

  const index = imports.findIndex((value) => !DEFAULT_IMPORT.includes(value));
  imports.splice(index, 0, insertedModule);
};

const insertModules = (insertedModules: string[], imports: string[]) => {
  insertedModules.forEach((insertedModule) => {
    insertModule(insertedModule, imports);
  });
};

const handleImportOrderDefault = (imports: (string | [string, string])[]) => {
  const sortImports = imports.map((value) =>
    Array.isArray(value) ? value[0] : value
  );

  insertModule("<ARRAY_REGEX_MODULES>", sortImports);
  insertModules(DEFAULT_IMPORT, sortImports);

  return sortImports;
};

export const getImportOrder = (options: Options) => {
  if (options.importOrder) {
    return handleImportOrderDefault(options.importOrder);
  }
  return [];
};
