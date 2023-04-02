# eslint-plugin-classify-imports

ESLint plugin to classify imports into external, internal, and unknown categories.

## Example

```js
"use client";

import type { ElementType } from "react";
import { Outfit } from "next/font/google";
import classcat from "classcat";
import "_@/styles/globals.css";
import Contact from "_@/layout/Contact";
import Footer from "_@/layout/Footer";
import Header from "_@/layout/Header";

import { nextApi } from "_@shared/utils/api";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
```

to

```js
"use client";

//THIRD PARTY MODULES
import "_@/styles/globals.css";
import classcat from "classcat";
import { Outfit } from "next/font/google";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

//LAYOUT
import Footer from "_@/layout/Footer";
import Header from "_@/layout/Header";
import Contact from "_@/layout/Contact";

//SHARED
import { nextApi } from "_@shared/utils/api";

//TYPES MODULES
import type { ElementType } from "react";
```

## Installation

```bash
npm install --save-dev eslint-plugin-classify-imports
```

## Usage

Add `classify-imports` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["classify-imports"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "classify-imports/classify-imports": [
      "error",
      {
        "importOrder": [
          "<THIRD_PARTY_MODULES> --comment THIRD PARTY MODULES",
          //regex start
          "(layout) --comment LAYOUT",
          "(shared) --comment SHARED",
          //regex end
          "<RELATIVE_MODULES> --comment RELATIVE MODULES",
          "<TYPES_MODULES> --comment TYPES MODULES"
        ],
        "importOrderSeparation": true,
        "importOrderSortByLength": true,
        "importOrderSplitType": true,
        "importWithSemicolon": false,
        "importOrderAddComments": true
      }
    ]
  }
}
```

## Options

### importOrder

An array of strings that will be used to classify the imports. The order of the strings will be used to sort the imports.

### importOrderSeparation

If true, the plugin will add a blank line between each import category.

### importOrderSortByLength

If true, the plugin will sort the imports by length.

### importOrderSplitType

If true, the plugin will split the imports into type and non-type imports.

### importWithSemicolon

If true, the plugin will add a semicolon to the end of each import.

### importOrderAddComments

If true, the plugin will add a comment to the top of each import category.

## License

MIT
