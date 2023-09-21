/*** APP ***/
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useLazyQuery,
} from "@apollo/client";

import { link } from "./link.js";
import { Layout } from "./layout.jsx";
import "./index.css";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

function App() {
  const [name, setName] = useState("");
  const [load, result] = useLazyQuery(ALL_PEOPLE);
  const { loading, data } = result;

  return (
    <main>
      <h2>Names</h2>
      {loading ? (
        <p>Loading…</p>
      ) : !data ? (
        <button onClick={async () => {
          try {
            await load()
          } catch (err) {
            console.error(err)
          }
        }}>Load</button>
      ) : (
        <ul>
          {data?.people.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}
      <pre>{JSON.stringify(result, ["data", "loading", "called", "error", "networkStatus"], 2)}</pre>
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>
);
