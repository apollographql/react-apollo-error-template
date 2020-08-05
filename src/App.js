import React, { Fragment } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
      friends {
        id
        name
      }
    }
  }
`;

const ADD_PERSON = gql`
  mutation AddPerson($name: String) {
    addPerson(name: $name) {
      id
      name
      friends {
        id
        name
      }
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
    data,
    refetch,
  } = useQuery(ALL_PEOPLE);
  
  const [addPerson] = useMutation(ADD_PERSON);
  const [addFriend] = useMutation(ADD_FRIEND, {
    optimisticResponse: {
      __typename: "Mutation",
      addFriend: {
        id: "2",
        __typename: "Person",
        name: "Sara Smith",
        friends: [{ 
          __typename: "Person",
          id: "3"
        }],
      }
    },
    update: (cache, { data: { addFriend } }) => {
      console.log(addFriend);
      cache.modify({
        id: cache.identify({
          __typename: "Person",
          id: "3",
        }),
        fields: {
          friends: existing => {
            const newFriend = cache.writeFragment({
              id: cache.identify(addFriend),
              fragment: gql`
                fragment NewFriend on Person {
                  id
                  name
                  friends
                }
              `,
              data,
            });

            return [...existing, newFriend];
          }
        }
      });
    }
  }); 

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <button
        onClick={() => {
          refetch();
        }}
      >
        Refetch
      </button>
      <button
        onClick={() => {
          addPerson({ variables: { name: 'Margaret Hamilton' } });
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
            <Fragment>
              <li key={person.id}>{person.name}</li>
              {person.friends.length > 0 && person.friends.map(friend => <li key={friend.id}>Friend: {friend.name}</li>)}
            </Fragment>
          ))}
        </ul>
      )}
    </main>
  );
}
