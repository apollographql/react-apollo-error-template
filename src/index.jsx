/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const peopleData = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sara Smith" },
  { id: "3", name: "Budd Deey" },
];

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },

		person: {
			type: PersonType,
			args: {
				id: { type: GraphQLID },
			},
			resolve: function(_, { id }) {
				return peopleData.find((person) => (person.id === id));
			},
		},
  },
});

const schema = new GraphQLSchema({
	query: QueryType,
});

/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
function delay(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

const link = new ApolloLink((operation) => {
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
    console.log("request", {query, operationName, variables});
    await delay(300);
    try {
      const result = await graphql(
        schema,
        print(query),
        null,
        null,
        variables,
        operationName
      );
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});

/*** APP ***/
import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	gql,
	useLazyQuery,
} from "@apollo/client";
import "./index.css";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

const GET_PERSON = gql`
  query GetPerson($id: ID) {
    person(id: $id) {
      id
      name
    }
  }
`;

function App() {
  const [view, setView] = useState(true);
  const [
    getAllPeople,
    { loading: peopleLoading, data: peopleData },
  ] = useLazyQuery(ALL_PEOPLE, {
    onCompleted() {
      console.log("ALL PEOPLE COMPLETED");
    },
  });
  const [
    getPerson,
    { loading: personLoading, data: personData },
  ] = useLazyQuery(GET_PERSON, {
    variables: {id: 1},
    onCompleted() {
      console.log("PERSON COMPLETED");
    },
  });

  useEffect(() => {
    if (view) {
      console.log("getAllPeople");
      getAllPeople();
    } else {
      console.log("getPerson");
      getPerson({ id: 1 });
    }
  }, [getAllPeople, getPerson, view]);
  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <button onClick={() => setView((view) => !view)}>
        {view ? "switch to get person" : "switch to get all people"}
      </button>
      <h2>Names</h2>
      <div>
        <div>peopleLoading: {JSON.stringify(peopleLoading)}</div>
        <div>personLoading: {JSON.stringify(personLoading)}</div>
        <div>peopleData: {JSON.stringify(peopleData)}</div>
        <div>personData: {JSON.stringify(personData)}</div>
      </div>
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
