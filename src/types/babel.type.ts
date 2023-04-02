import {
  CommentBlock,
  CommentLine,
  ImportDeclaration,
  SourceLocation,
} from "@babel/types";

type Ast = { program: { body: ImportDeclaration[] } };

type Position = {
  line: number;
  column: number;
  index: number;
};

type Loc = {
  start: Position;
  end: Position;
};

interface Context {
  options: any[];
  getSourceCode(): {
    getText(): string;
  };
  report(options: {
    node?: ImportDeclaration;
    loc?: SourceLocation | null | undefined;
    message: string;
    fix?: (fixer: {
      replaceTextRange: (range: number[], text: string) => void;
    }) => void;
  }): void;
}

export { Ast, CommentBlock, CommentLine, ImportDeclaration, Loc, Context };
