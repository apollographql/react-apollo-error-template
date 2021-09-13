/*** SCHEMA ***/
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from "graphql";

const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: {
    country: { type: GraphQLString },
  },
});

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: {
      type: AddressType,
      args: {
        arg: {
          type: GraphQLInt,
        },
      },
    },
  },
});

const peopleData = [
  { id: 1, name: "John Smith", address: { country: "UK" } },
  { id: 2, name: "Sara Smith", address: { country: "UK" } },
  { id: 3, name: "Budd Deey", address: { country: "UK" } }
];

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    person: {
      type: PersonType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: (_root, args) =>
        peopleData.find((cur) => cur.id === parseInt(args.id, 10))
    },
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData
    }
  }
});

const schema = new GraphQLSchema({ query: QueryType });

/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
function delay(wait) {
  return new Promise(resolve => setTimeout(resolve, wait));
}

const link = new ApolloLink(operation => {
  return new Observable(async observer => {
    const { query, operationName, variables } = operation;
    await delay(300);
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
import React from "react";
import "./index.css";

import { gql, useQuery } from "@apollo/client";
import { useEffect, useRef } from "react";

const queryA = gql`
  query QueryA($id: ID!) {
    person(id: $id) {
      id
      name
    }
  }
`;

const queryB = gql`
  query QueryB($id: ID!, $arg: Int = 2) {
    person(id: $id) {
      id
      name
      address(arg: $arg) {
        country
      }
    }
  }
`;

let renderCount = 0;
export default function App() {
  const nodeRef = useRef();

  renderCount++;

  const resultA = useQuery(queryA, {
    variables: { id: 1 }
  });
  const resultB = useQuery(queryB, {
    variables: { id: 1 },
    skip: !resultA.data,
    notifyOnNetworkStatusChange: true
  });

  useEffect(() => {
    const node = nodeRef.current;
    node.innerHTML += `<div>
      <p>Render: ${renderCount}</p>
      <pre>
        ${JSON.stringify({ a: resultA.data, b: resultB.data }, null, 2)}
      </pre>
    </div>
    <hr />`;
  });

  return <div ref={nodeRef} />;
}

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import {render} from "react-dom";

const cache = new InMemoryCache();

//cache.writeQuery({
//  query: queryA,
//  variables: { id: 1 },
//  data: {
//    person: { id: 1, name: "John from cache", __typename: 'Person' },
//  },
//});

const client = new ApolloClient({ link, cache });

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root"),
);
