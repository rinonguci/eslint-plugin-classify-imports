export const DEFAULT_IMPORT = [
  "<RELATIVE_MODULES>",
  "<TYPES_MODULES>",
  "<THIRD_PARTY_MODULES>",
  // '<ARRAY_REGEX_MODULES>',
] as const;
type DefaultImport = typeof DEFAULT_IMPORT[number];

export const DEFAULT_IMPORT_WITH_COMMENT: { [key in DefaultImport]: string } = {
  "<RELATIVE_MODULES>": "<RELATIVE_MODULES> --comment OTHERS",
  "<TYPES_MODULES>": "<TYPES_MODULES> --comment TYPES MODULES",
  "<THIRD_PARTY_MODULES>":
    "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
};
