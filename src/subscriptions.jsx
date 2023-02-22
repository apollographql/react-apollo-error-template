import { gql, useSubscription } from "@apollo/client";

const query = gql`
  subscription {
    numberIncremented
  }
`;

export function Subscriptions() {
  const { data, error, loading } = useSubscription(query);
  if (loading) return <p>Loading...</p>;
  if (error) return <SubscriptionError />
  return (
    <>
      <h3>Response: </h3>
      <p>Score: {data?.numberIncremented}</p>
    </>
  );
}

function SubscriptionError() {
  return (
    <>
      <p>Error :(</p>
      <p>
        The CodeSandbox serving our WebSocket API may be sleeping, please
        visit{" "}
        <a href="https://nyx00g.sse.codesandbox.io/graphql" target="_blank">
          https://nyx00g.sse.codesandbox.io/graphql
        </a>{" "}
        to wake it up. Once you see the{" "}
        <a
          href="https://www.apollographql.com/docs/graphos/explorer/explorer/"
          target="_blank"
        >
          Apollo Studio Explorer
        </a>{" "}
        IDE at the link above, you can refresh this page.
      </p>
    </>
  );
}