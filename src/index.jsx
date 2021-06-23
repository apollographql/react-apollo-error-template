/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    updated: { type: GraphQLFloat },
  },
});

const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => {
        return peopleData.map((person) => ({...person, updated: Date.now()}));
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name,
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });

/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
function delay(wait) {
  return new Promise(resolve => setTimeout(resolve, wait));
}

const link = new ApolloLink(operation => {
  return new Observable(async observer => {
    const { query, operationName, variables } = operation;
    await delay(operationName === 'addPerson' ? 3000 : 300);
    try {
      const result = await graphql(
        schema,
        print(query),
        null,
        null,
        variables,
        operationName,
      );
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

/*** APP ***/
import React, { useState } from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";
import "./index.css";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
      updated
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

function PeopleList() {
  const { loading, data } = useQuery(ALL_PEOPLE, { pollInterval: 1000 });
  return loading ? (
    <p>Loading…</p>
  ) : (
    <ul>
      {data?.people.map(person => (
        <li key={person.id}>{person.name} ({person.updated})</li>
      ))}
    </ul>
  );
}

function App() {
  const [name, setName] = useState('');
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson: addPersonData } }) {
      const peopleResult = cache.readQuery({ query: ALL_PEOPLE });
      cache.writeQuery({
        query: ALL_PEOPLE,
        data: {
          ...peopleResult,
          people: [
            ...peopleResult.people,
            addPersonData,
          ],
        },
      });
    },
  });

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <div className="add-person">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
        <button
          onClick={() => {
            addPerson({
              variables: { name },
              optimisticResponse: {
                addPerson: {
                  id: null,
                  name: `${name} (optimistic)`,
                  __typename: 'Person',
                  updated: Date.now(),
                },
              },
            });
            setName('');
          }}
        >
          Add person
        </button>
      </div>
      <h2>Names</h2>
      <PeopleList />
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
