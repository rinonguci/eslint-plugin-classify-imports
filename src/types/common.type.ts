interface Options {
  importOrder: (string | [string, string])[];
  importOrderSeparation?: boolean;
  importOrderSortByLength?: boolean;
  importOrderSplitType?: boolean;
  importWithSemicolon?: boolean;
  importOrderAddComments?: boolean;
}

type OptionsInput = Omit<Options, "importOrder"> & {
  importOrder: string[];
};

export { Options, OptionsInput };
