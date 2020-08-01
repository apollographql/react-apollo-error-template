import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

const ADD_PERSON = gql`
  mutation AddPerson($name: String) {
    addPerson(name: $name) {
      id
      name
    }
  }
`;

const ADD_FRIEND = gql`
  mutation AddFriend($id: ID!, $friendId: ID!) {
    addFriend(id: $id, friendId: $friendId) {
      id
      name
      friends {
        id
        name
      }
    }
  }
`;

export default function App() {
  const {
    loading,
    data
  } = useQuery(ALL_PEOPLE);
  
  const [addPerson] = useMutation(ADD_PERSON);
  const [addFriend] = useMutation(ADD_FRIEND);
  console.log(data);
  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <button
        onClick={() => {
          addPerson({ variables: { name: 'Taylor Swift' } });
        }}
      >
        Add person
      </button>
      <button
        onClick={() => {
          addFriend({ 
            variables: { 
              id: "1", 
              friendId: "2",
            } 
          });
        }}
      >
        Add friend
      </button>
      <h2>Names</h2>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {data?.people.map(person => (
            <li key={person.id}>{person.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
