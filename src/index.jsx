import React, { useEffect } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  useQuery,
  gql
} from "@apollo/client";
import "./index.css";

const QUERY = gql`
  {
    continents {
      code
      name
    }
  }
`;

function Left() {
  const [count, setCount] = React.useState(1);
  const { data } = useQuery(QUERY, {
    pollInterval: 1000,
    notifyOnNetworkStatusChange: true
  });
  useEffect(
    () => () => {
      console.log("Left unmounted");
    },
    []
  );
  // useEffect(() => {
  //   startPolling(1000);
  //   return () => {
  //     stopPolling();
  //   };
  // }, [startPolling, stopPolling]);

  return (
    <div>
      <button
        onClick={() => {
          setCount((v) => v + 1);
        }}
      >
        increase
      </button>
      {`Left ${count}`}

      <div>
        <code>{JSON.stringify(data)}</code>
      </div>
    </div>
  );
}

function Right() {
  return <div>right</div>;
}

function App() {
  const [isLeft, setIsLeft] = React.useState(false);
  return (
    <div className="App">
      <button
        onClick={() => {
          setIsLeft((v) => !v);
        }}
      >
        Toggle
      </button>
      {isLeft ? <Left /> : <Right />}
    </div>
  );
}

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: "https://countries.trevorblades.com/",
  cache,
});


import {render} from "react-dom";
render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
