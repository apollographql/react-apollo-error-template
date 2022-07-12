/*** APP ***/
import React from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";
import "./index.css";

const UPDATE_TRAIL = gql`
  mutation UpdateTrail($trailId: ID!, $status: TrailStatus!) {
    setTrailStatus(id: $trailId, status: $status) {
      id
      status
    }
  }
`;

const ALL_TRAILS = gql`
  query allTrails {
    allTrails {
      id
      name
      status
    }
  }
`;

function App() {
  return (
    <main>
      <TrailsList />
    </main>
  );
}

const TrailsList = () => {
  const { data, loading } = useQuery(ALL_TRAILS);

  return (
    <>
      <h2>Ski Lifts</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.allTrails.map((trail) => (
            <Trail key={trail.id} id={trail.id} {...trail} />
          ))}
        </ul>
      )}
    </>
  );
};

const Trail = ({ id, name, status }) => {
  const [updateTrail] = useMutation(UPDATE_TRAIL);

  return (
    <li key={id}>
      {name} - {status}
      <input
        checked={status === 'OPEN' ? true : false}
        type="checkbox"
        onChange={(e) => {
          updateTrail({
            variables: {
              trailId: id,
              status: e.target.checked ? 'OPEN' : 'CLOSED',
              }
            })
          }
        }
      />
    </li>
  );
}

const client = new ApolloClient({
  uri: 'https://snowtooth.moonhighway.com',
  cache: new InMemoryCache(),
});
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
