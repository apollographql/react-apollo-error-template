/*** APP ***/
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  type TypedDocumentNode,
} from "@apollo/client";
import { Defer20220824Handler } from "@apollo/client/incremental";
import { LocalState } from "@apollo/client/local-state";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client/react";

import { link } from "./link.js";
import { Subscriptions } from "./subscriptions.jsx";
import { Layout } from "./layout.jsx";
import "./index.css";
import type {
  AddPersonMutation,
  AddPersonMutationVariables,
  AllPeopleQuery,
  AllPeopleQueryVariables,
} from "./types/__generated__/graphql.js";

const ALL_PEOPLE: TypedDocumentNode<AllPeopleQuery, AllPeopleQueryVariables> =
  gql`
    query AllPeople {
      people {
        id
        name
      }
    }
  `;

const ADD_PERSON: TypedDocumentNode<
  AddPersonMutation,
  AddPersonMutationVariables
> = gql`
  mutation AddPerson($name: String) {
    addPerson(name: $name) {
      id
      name
    }
  }
`;

function App() {
  const [name, setName] = useState("");
  const { loading, data } = useQuery(ALL_PEOPLE);

  const [addPerson] = useMutation(ADD_PERSON, {
    update: (cache, { data: { addPerson: addPersonData } }) => {
      const peopleResult = cache.readQuery({ query: ALL_PEOPLE });

      cache.writeQuery({
        query: ALL_PEOPLE,
        data: {
          ...peopleResult,
          people: [...peopleResult.people, addPersonData],
        },
      });
    },
  });

  return (
    <main>
      <h3>Home</h3>
      <div className="add-person">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
        <button
          onClick={() => {
            addPerson({ variables: { name } });
            setName("");
          }}
        >
          Add person
        </button>
      </div>
      <h2>Names</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.people.map((person) => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  localState: new LocalState(),
  incrementalHandler: new Defer20220824Handler(),
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="subscriptions-wslink" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  </ApolloProvider>,
);
