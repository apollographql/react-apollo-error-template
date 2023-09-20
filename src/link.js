/*** LINK ***/
import { ApolloLink, HttpLink } from "@apollo/client";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { worker } from "./mocks/browser.js";

worker.start({ waitUntilReady: true });
const mockedHttpLink = new HttpLink({
  uri: "http://localhost:3000/graphql",
});

const url = "wss://uifesi.sse.codesandbox.io/graphql";

const wsLink = new GraphQLWsLink(
  createClient({
    url,
  })
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
  mockedHttpLink
);
