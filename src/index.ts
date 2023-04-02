import { classifyImport } from "./common/classifyImport";
import { convertNodesToString } from "./common/convertNodesToString";
import { formatOptions } from "./common/formatOptions";
import { getImportNodes } from "./common/getImportNodes";
import { getImportOrder } from "./common/handleImportOrderDefault";
import { parseCodeToAst } from "./common/parseCodeToAst";
import {
  CommentBlock,
  CommentLine,
  Context,
  ImportDeclaration,
  Loc,
} from "./types/babel.type";
import { Options } from "./types/common.type";

const classifyImportToCode = (body: ImportDeclaration[], options: Options) => {
  const generateImportGroup = (
    comment: string,
    group: ImportDeclaration[],
    newLine: string
  ) => {
    if (options.importOrderAddComments) {
      return (
        `//${comment}\n` + convertNodesToString(group).join("\n") + newLine
      );
    }
    return convertNodesToString(group).join("\n") + newLine;
  };

  const importOrder = getImportOrder(options);
  const imports = classifyImport(body, options);
  const commentsWithImportOrder = options.importOrder.reduce(
    (acc, [key, value]: any) => {
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: string }
  );

  const importsList: Record<string, ImportDeclaration[]> = {
    "<THIRD_PARTY_MODULES>": imports.thirdPartyImports,
    "<TYPES_MODULES>": imports.importTypeImports,
    ...imports.arrayRegexImports,
    "<RELATIVE_MODULES>": imports.relativePathImports,
  };

  let newCode = "";
  let newLine = options.importOrderSeparation ? "\n\n" : "\n";

  importOrder.forEach((importType) => {
    const group = importsList[importType];
    if (group?.length) {
      const comment = commentsWithImportOrder[importType];

      newCode += generateImportGroup(comment || importType, group, newLine);
    }
  });

  if (!options.importWithSemicolon) {
    newCode = newCode.replace(new RegExp(";", "g"), "");
  }

  return newCode.replace(new RegExp(newLine + "$"), "");
};

type ImportOrComment = ImportDeclaration | Comment | CommentBlock | CommentLine;
const sortImportPlugin = (code: string, mergeOptions: Options) => {
  const formatComments = (
    allImports: ImportDeclaration[],
    commentsCustom: string[]
  ) => {
    return allImports.map((node) => {
      const { trailingComments, leadingComments, ...rest } = node;
      if (leadingComments && leadingComments.length > 0) {
        const filteredComments = leadingComments.filter(
          (comment) =>
            !Boolean(commentsCustom.find((value) => comment.value.match(value)))
        );

        return filteredComments.length === 0
          ? rest
          : { ...rest, leadingComments: filteredComments };
      }
      return rest;
    });
  };

  const getFirstAndLastNode = () => {
    let firstImportOrComment: ImportOrComment | undefined = allImports[0];
    if (
      firstImportOrComment.leadingComments &&
      firstImportOrComment.leadingComments.length > 0
    ) {
      firstImportOrComment = firstImportOrComment.leadingComments[0];
    }
    const lastImport = allImports[allImports.length - 1];
    return { firstImportOrComment, lastImport };
  };

  const getImportWithMessage = (
    allImports: ImportDeclaration[],
    sortedImports: ImportDeclaration[]
  ) => {
    return allImports.map((node) => {
      let newImport = sortedImports.find(
        (value) => value.source.value === node.source.value
      );
      if (!newImport) return;
      const lineCurrent = node.loc?.end.line;
      let lineNew = newImport.loc?.end.line;

      if (lineCurrent !== lineNew) {
        return {
          message: `Import ${node.source.value} moved from line ${lineCurrent} to line ${lineNew}`,
          node,
        };
      }

      return {
        node,
      };
    });
  };

  const commentsCustom = mergeOptions.importOrder
    .map((value) => value?.[1])
    .filter(Boolean);

  const parseCode = parseCodeToAst(code);
  const allImports = getImportNodes(parseCode);

  const { firstImportOrComment, lastImport } = getFirstAndLastNode();
  if (!firstImportOrComment?.loc || !lastImport?.loc)
    throw new Error("No import found");
  const firstImportLoc = firstImportOrComment.loc as unknown as Loc;
  const lastImportLoc = lastImport.loc as unknown as Loc;

  const newAllImports = formatComments(allImports, commentsCustom);
  const newCode = classifyImportToCode(newAllImports, mergeOptions).replace(
    /[\n]*$/,
    ""
  );

  const textToFirstImport = code.slice(0, firstImportLoc.start.index);
  const sortedImports = getImportNodes(
    parseCodeToAst(textToFirstImport + newCode)
  );

  return {
    allImportWithMessage: getImportWithMessage(allImports, sortedImports),
    newCode,
    loc: {
      start: firstImportLoc.start,
      end: lastImportLoc.end,
    },
  };
};

const optionsDefault = {
  importOrder: [
    "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
    //regex
    "<RELATIVE_MODULES> --comment RELATIVE MODULES",
    "<TYPES_MODULES> --comment TYPES MODULES",
  ],
  importOrderSeparation: true,
  importOrderSortByLength: true,
  importOrderSplitType: true,
  importWithSemicolon: false,
  // importOrderAddComments: true,
};

const create = (context: Context) => {
  const options = context.options[0] || {};
  const mergeOptions = {
    ...formatOptions(optionsDefault),
    ...formatOptions(options),
  } as Options;
  const pluginName = "plugin classify imports wrongs";

  return {
    Program() {
      try {
        const code = context.getSourceCode().getText();
        const { allImportWithMessage, loc, newCode } = sortImportPlugin(
          code,
          mergeOptions
        );

        let flag = false;
        allImportWithMessage.forEach((value) => {
          if (!value?.message) return;
          flag = true;

          context.report({
            node: value.node,
            loc: value.node.loc,
            message: value.message,
          });
        });

        if (flag) {
          context.report({
            loc,
            message: "classify imports error",
            fix(fixer) {
              return fixer.replaceTextRange(
                [loc.start.index, loc.end.index],
                newCode
              );
            },
          });
        }
      } catch (error) {
        console.error(`Error in ${pluginName}:`, error);
      }
    },
  };
};

module.exports = {
  rules: {
    "classify-imports": {
      meta: { fixable: "code" },
      create,
    },
  },
};
