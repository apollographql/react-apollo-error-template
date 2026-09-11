/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { schema } from "./schema.js";
import { OperationTypeNode } from "graphql";

function delay(wait: number) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

function logRequest(operation: ApolloLink.Operation) {
  console.group(operation.operationType, operation.operationName, "request:");
  console.log("variables:", operation.variables);
  console.log("extensions:", operation.extensions);
  console.log("context:", operation.getContext());
  console.groupEnd();
}

function logResponse(
  operation: ApolloLink.Operation,
  initialTimestamp: number,
  result: { ok: true; result: unknown } | { ok: false; error: unknown },
) {
  console.group(operation.operationType, operation.operationName, "response:");
  console.log("variables:", operation.variables);

  if (result.ok) {
    console.log("result:", result.result);
  } else {
    console.error(result.error);
  }

  console.log("took:", Math.round(performance.now() - initialTimestamp) + "ms");
  console.groupEnd();
}

const staticDataLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    Promise.resolve().then(async () => {
      const { query, operationName, variables } = operation;
      const timestamp = performance.now();

      logRequest(operation);
      await delay(300);
      try {
        const result = await graphql({
          schema,
          source: print(query),
          variableValues: variables,
          operationName,
        });

        logResponse(operation, timestamp, { ok: true, result });

        observer.next(result);
        observer.complete();
      } catch (err) {
        logResponse(operation, timestamp, {
          ok: false,
          error: err,
        });
        observer.error(err);
      }
    });
  });
});

const url = "wss://uifesi.sse.codesandbox.io/graphql";

const wsLink = new GraphQLWsLink(
  createClient({
    url,
  }),
);

// Use directional composition in order to customize the terminating link
// based on operation type: a WebSocket for subscriptions and our own
// custom ApolloLink for everything else.
// For more information, see: https://www.apollographql.com/docs/react/api/link/introduction/#directional-composition
export const link = ApolloLink.split(
  (operation) => operation.operationType === OperationTypeNode.SUBSCRIPTION,
  wsLink,
  staticDataLink,
);
