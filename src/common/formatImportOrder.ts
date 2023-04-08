import { DEFAULT_IMPORT, DEFAULT_IMPORT_WITH_COMMENT } from "../constant";

type Module = typeof DEFAULT_IMPORT[number];
const insertModule = (
  insertedModule: Module | "<ARRAY_REGEX_MODULES>",
  imports: string[],
  isRegex: boolean = false
) => {
  if (imports.find((value) => value.match(insertedModule))) {
    return;
  }

  const index = imports.findIndex(
    (value) =>
      !DEFAULT_IMPORT.find((v) => {
        return value.match(v);
      })
  );

  if (isRegex) {
    imports.splice(index, 0, insertedModule);
  } else {
    imports.splice(
      imports.length,
      0,
      (DEFAULT_IMPORT_WITH_COMMENT as any)?.[insertedModule]
    );
  }
};

const insertModules = (insertedModules: Module[], imports: string[]) => {
  insertedModules.forEach((insertedModule) => {
    insertModule(insertedModule, imports);
  });
};

export const formatImportOrder = (imports: string[]) => {
  insertModule("<ARRAY_REGEX_MODULES>", imports, true);
  insertModules(DEFAULT_IMPORT as any, imports);

  return imports;
};
