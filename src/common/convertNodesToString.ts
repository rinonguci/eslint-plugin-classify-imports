import generator from "babel-generator";
import { ImportDeclaration } from "../types/babel.type";

export const convertNodesToString = (arr: ImportDeclaration[]) => {
  return arr.map((value) => {
    return generator(value as any, {
      comments: true,
      retainLines: true,
    }).code.replace(/^[\n]*/, "");
  });
};
