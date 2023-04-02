import { Ast, ImportDeclaration } from "../types/babel.type";

export const getImportNodes = (ast: Ast) => {
  return ast.program.body.filter(
    (node) => node.type === "ImportDeclaration"
  ) as ImportDeclaration[];
};
