/*** LINK ***/
import { ApolloLink, ApolloClient, split, InMemoryCache } from "@apollo/client";
import { Observable, getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createUploadLink } from "apollo-upload-client";

const url = "uifesi.sse.codesandbox.io/graphql";

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then(async (operation) => {
          const jwt = "hello";
          if (jwt) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${jwt}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));
      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://${url}`,
  })
);

const httpLink = createUploadLink({
  uri: `http://${url}`,
  credentials: "include",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  ApolloLink.from([requestLink, httpLink])
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: "include",
});
