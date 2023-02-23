import { gql, useSubscription } from "@apollo/client";

const query = gql`
  subscription {
    numberIncremented
  }
`;

export function Subscriptions() {
  const { data, error, loading } = useSubscription(query);
  if (loading) return <p>Loading...</p>;
  return (
    <>
      <h3>Subscriptions</h3>
      {error ? (
        <SubscriptionError />
      ) : (
        <>
          <h4>Response: </h4>
          <p>Score: {data?.numberIncremented}</p>
        </>
      )}
    </>
  );
}

function SubscriptionError() {
  return (
    <>
      <p>Error :(</p>
      <p>
        The CodeSandbox serving our WebSocket API may be sleeping, please visit{" "}
        <a href="https://uifesi.sse.codesandbox.io/graphql" target="_blank">
          https://uifesi.sse.codesandbox.io/graphql
        </a>{" "}
        to wake it up.
      </p>
      <p>
        Once you see the{" "}
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
