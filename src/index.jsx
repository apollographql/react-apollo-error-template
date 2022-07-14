/*** APP ***/
import React, { useState } from "react";
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
  query allTrailsWithFragment {
    allTrails {
      id
      ...TrailFragment
    }
  }
  ${TrailFragment}
`;

function App() {
  const { data, loading } = useQuery(ALL_TRAILS);
  useBackgroundQuery({ query: ALL_TRAILS_WITH_FRAGMENT });

  return (
    <main>
      <h2>Ski Lifts</h2>
      <TrailSelectAndDetails trails={data?.allTrails} />
      <TrailsList trails={data?.allTrails} loading={loading} />
    </main>
  );
}

const TrailSelectAndDetails = ({ trails }) => {
  const [currentTrailId, setCurrentTrail] = useState();
  const currentlySelectedTrail = React.useMemo(
    () => trails?.find((t) => t.id === (currentTrailId || trails[0].id)),
    [currentTrailId, trails]
  );

  return (
    <>
      <select onChange={(e) => setCurrentTrail(e.currentTarget.value)}>
        {trails?.map((trail) => (
          <option key={trail.id}>{trail.id}</option>
        ))}
      </select>
      {currentlySelectedTrail?.id && (
        <TrailDetails id={currentlySelectedTrail.id} />
      )}
    </>
  );
};

const TrailDetails = ({ id }) => {
  const { data } = useFragment({
    fragment: TrailFragment,
    from: {
      __typename: "Trail",
      id,
    },
  });

  return (
    <h3 style={{ marginTop: "2rem" }}>
      {data.name} - {data.status}
    </h3>
  );
};

const TrailsList = ({ trails, loading }) => {
  return (
    <>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {trails?.map((trail) => (
            <Trail key={trail.id} id={trail.id} />
          ))}
        </ul>
      )}
    </>
  );
};

const Trail = ({ id }) => {
  const [updateTrail] = useMutation(UPDATE_TRAIL);
  const { data } = useFragment({
    fragment: TrailFragment,
    from: {
      __typename: "Trail",
      id,
    },
  });
  console.log({ data, id });

  return (
    <li key={id}>
      {data.name} - {data.status}
      <input
        checked={data.status === "OPEN" ? true : false}
        type="checkbox"
        onChange={(e) => {
          updateTrail({
            variables: {
              trailId: id,
              status: e.target.checked ? "OPEN" : "CLOSED",
            },
          });
        }}
      />
    </li>
  );
};

const client = new ApolloClient({
  uri: "https://snowtooth.moonhighway.com",
  cache: new InMemoryCache(),
});
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
