import { Node } from "@babel/types";
import generator from "babel-generator";

export const codeWithoutComment = (node: Node) => {
  return generator(node as any, { comments: false }).code;
};
