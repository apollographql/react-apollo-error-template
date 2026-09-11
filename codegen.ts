import type { CodegenConfig } from "@graphql-codegen/cli";
import type { TypeScriptDocumentsPluginConfig } from "@graphql-codegen/typescript-operations";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  documents: ["src/**/*.{ts,tsx}"],
  // Don't exit with non-zero status when there are no documents
  ignoreNoDocuments: true,
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
  generates: {
    "./src/types/__generated__/graphql.ts": {
      plugins: ["typescript-operations"],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        dedupeOperationSuffix: true,
        defaultScalarType: "unknown",
      } satisfies TypeScriptDocumentsPluginConfig,
    },
  },
};
export default config;
