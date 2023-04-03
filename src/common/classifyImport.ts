import { ImportDeclaration } from "../types/babel.type";
import { Options } from "../types/common.type";
import { codeWithoutComment } from "./codeWithoutComment";

const importTypes = {
  isTypeImport: (node: ImportDeclaration) => {
    return node.importKind === "type";
  },
  isThirdPartyImport: (node: ImportDeclaration, options: Options) => {
    return (
      !options?.importOrder?.some((regex) =>
        new RegExp(regex as string).test(node.source.value)
      ) && !new RegExp(/^\./).test(node.source.value)
    );
  },
  isArrayRegexImport: (node: ImportDeclaration, options: Options) => {
    return options?.importOrder?.find((regex) =>
      new RegExp(regex as string).test(node.source.value)
    ) as string;
  },
  isRelativePathImport: (node: ImportDeclaration) => {
    return new RegExp(/^\./).test(node.source.value);
  },
};

const sortByAlphaB = (array: ImportDeclaration[]) => {
  array.sort((a, b) => a.source.value.localeCompare(b.source.value));
};

const importOrderSortByLength = (array: ImportDeclaration[]) => {
  const generatorWithOutComments = (node: ImportDeclaration) =>
    codeWithoutComment(node);
  array.sort(
    (a, b) =>
      generatorWithOutComments(a).length - generatorWithOutComments(b).length
  );
};

const sortTypes = (array: ImportDeclaration[], options: Options) => {
  if (options.importOrderSortByLength) {
    importOrderSortByLength(array);
  } else {
    sortByAlphaB(array as ImportDeclaration[]);
  }
};

export const classifyImport = (
  body: ImportDeclaration[],
  _options: Options
) => {
  const importTypeImports: ImportDeclaration[] = [];
  const thirdPartyImports: ImportDeclaration[] = [];
  const arrayRegexImports: Record<string, ImportDeclaration[]> = {};
  const relativePathImports: ImportDeclaration[] = [];

  const options = {
    ..._options,
    importOrder: _options.importOrder.map((value) =>
      Array.isArray(value) ? value[0] : value
    ),
  };

  body.forEach((node) => {
    if (node.type === "ImportDeclaration") {
      if (options.importOrderSplitType && importTypes.isTypeImport(node)) {
        importTypeImports.push(node);
      } else if (importTypes.isThirdPartyImport(node, options)) {
        thirdPartyImports.push(node);
      } else if (importTypes.isRelativePathImport(node)) {
        relativePathImports.push(node);
      } else {
        const regex = importTypes.isArrayRegexImport(node, options);
        if (regex) {
          if (!arrayRegexImports[regex]) arrayRegexImports[regex] = [];
          arrayRegexImports[regex].push(node);
        }
      }
    }
  });

  sortTypes(importTypeImports, options);
  sortTypes(thirdPartyImports, options);
  sortTypes(relativePathImports, options);

  Object.values(arrayRegexImports).forEach((array) => {
    sortTypes(array, options);
  });

  return {
    importTypeImports,
    thirdPartyImports,
    arrayRegexImports,
    relativePathImports,
  };
};
