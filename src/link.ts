/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { schema } from "./schema.js";

function delay(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

const staticDataLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    Promise.resolve().then(async () => {
      const { query, operationName, operationType, variables, extensions } =
        operation;
      const label = `${operationType} ${operationName}`;
      const now = performance.now();

      console.group(label, "request:");
      console.log("variables:", variables);
      console.log("extensions:", extensions);
      console.log("context:", operation.getContext());
      console.groupEnd();

      await delay(300);
      try {
        const result = await graphql({
          schema,
          source: print(query),
          variableValues: variables,
          operationName,
        });

        console.group(label, "response:");
        console.log("result:", result);
        console.log("took:", Math.round(performance.now() - now) + "ms");

        observer.next(result);
        observer.complete();
      } catch (err) {
        console.group(label, "response:");
        console.log("took:", Math.round(performance.now() - now) + "ms");
        console.error(err);

        observer.error(err);
      }
      console.groupEnd();
    });
  });
});

const url = "wss://uifesi.sse.codesandbox.io/graphql";

const wsLink = new GraphQLWsLink(
  createClient({
    url,
  }),
);

const definitionIsSubscription = (d) => {
  return d.kind === "OperationDefinition" && d.operation === "subscription";
};

// Use directional composition in order to customize the terminating link
// based on operation type: a WebSocket for subscriptions and our own
// custom ApolloLink for everything else.
// For more information, see: https://www.apollographql.com/docs/react/api/link/introduction/#directional-composition
export const link = ApolloLink.split(
  (operation) => operation.query.definitions.some(definitionIsSubscription),
  wsLink,
  staticDataLink,
);
