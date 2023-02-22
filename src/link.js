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
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
    await delay(300);
    try {
      const result = await graphql({
        schema,
        source: print(query),
        variableValues: variables,
        operationName,
      });
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

const url = "wss://nyx00g.sse.codesandbox.io/graphql";

const wsLink = new GraphQLWsLink(
  createClient({
    url,
  })
);

const definitionIsSubscription = (d) => {
  return d.kind === "OperationDefinition" && d.operation === "subscription";
};

// Create a bidirectional link in order to use different terminating links
// depending on the operation type: a WebSocket for subscriptions and our own
// custom ApolloLink for everything else.
export const link = ApolloLink.split(
  (operation) => operation.query.definitions.some(definitionIsSubscription),
  wsLink,
  staticDataLink
);
