import { gql, type TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import type {
  AddPersonMutation,
  AddPersonMutationVariables,
  AllPeopleQuery,
  AllPeopleQueryVariables,
} from "./types/__generated__/graphql";

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

export function App() {
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
