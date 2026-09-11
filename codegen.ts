import type { CodegenConfig } from "@graphql-codegen/cli";
import type { TypeScriptDocumentsPluginConfig } from "@graphql-codegen/typescript-operations";
import type { TypeScriptResolversPluginConfig } from "@graphql-codegen/typescript-resolvers";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./src/schema.graphql",
  documents: ["src/**/*.{ts,tsx}"],
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
    "./src/types/__generated__/resolvers.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        defaultScalarType: "unknown",
        useTypeImports: true,
      } satisfies TypeScriptResolversPluginConfig,
    },
  },
};
export default config;
