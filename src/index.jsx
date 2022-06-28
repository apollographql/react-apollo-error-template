/*** APP ***/
import React from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useBackgroundQuery,
  useFragment,
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

const TrailFragment = gql`
  fragment TrailFragment on Trail {
    name
    status
    difficulty
  }
`;

const ALL_TRAILS = gql`
  query allTrails {
    allTrails {
      id
    }
  }
`;

const ALL_TRAILS_WITH_FRAGMENT = gql`
  query allTrails {
    allTrails {
      id
      ...TrailFragment
    }
  }
  ${TrailFragment}
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
  useBackgroundQuery({ query: ALL_TRAILS_WITH_FRAGMENT });

  return (
    <>
      <h2>Ski Lifts</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.allTrails.map((trail) => (
            <Trail key={trail.id} id={trail.id} />
          ))}
        </ul>
      )}
    </>
  );
};

const Trail = (props) => {
  const { data } = useFragment({
    fragment: TrailFragment,
    from: {
      __typename: "Trail",
      id: props.id,
    },
  });

  const [updateTrail] = useMutation(UPDATE_TRAIL, {
    update: (cache, { data: { setTrailStatus: updateTrailData } }) => {
      cache.updateFragment(
        {
          id: updateTrailData.id,
          fragment: TrailFragment,
        },
        (data) => ({ ...data, status: updateTrailData.status })
      );
    },
  });

  return (
    <li key={props.id}>
      {data.name} - {data.status}
      <input
        checked={data.status === 'OPEN' ? true : false}
        type="checkbox"
        onChange={(e) => {
          updateTrail({
            variables: {
              trailId: props.id,
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
