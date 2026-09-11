import "@apollo/client";
import { GraphQLCodegenDataMasking } from "@apollo/client/masking";
import { Defer20220824Handler } from "@apollo/client/incremental";
import { HttpLink } from "@apollo/client";

declare module "@apollo/client" {
  export interface TypeOverrides
    extends
      GraphQLCodegenDataMasking.TypeOverrides,
      Defer20220824Handler.TypeOverrides {
    signatureStyle: "modern";
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultContext extends HttpLink.ContextOptions {}
}
