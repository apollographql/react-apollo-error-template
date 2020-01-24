import React from "react";
import { gql, useQuery } from "@apollo/client";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

const ONE_PERSON = gql`
  query OnePerson($id: ID) {
    person(id: $id) {
      id
      name
    }
  }
`;

export default function App() {
  const allPeople = useQuery(ALL_PEOPLE);

  const id = 2;
  const { data: { person } = {}, loading } = useQuery(ONE_PERSON, {
    variables: { id },
  });

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <h2>Names</h2>
      {allPeople.loading || loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          <li>
            All people:
            <ul>
              {allPeople.data.people.map(person => (
                <li key={person.id}>{person.name}</li>
              ))}
            </ul>
          </li>
          <li>
            Person {id}:
            <ul>
              <li>{person.name}</li>
              <li><pre>{JSON.stringify(person)}</pre></li>
            </ul>
          </li>
        </ul>
      )}
    </main>
  );
}
