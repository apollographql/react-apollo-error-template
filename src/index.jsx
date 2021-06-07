import React from "react";
import { render } from "react-dom";
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema
} from "graphql";
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery
} from "@apollo/client";
import "./index.css";

const ChildType = new GraphQLObjectType({
  name: "ChildType",
  fields: {
    id: { type: GraphQLID }
  }
});

const ParentType = new GraphQLObjectType({
  name: "ParentType",
  fields: {
    id: { type: GraphQLID },
    children: { type: new GraphQLList(ChildType) }
  }
});

//const count = Math.pow(2, 15) - 1;
const count = Math.pow(2, 16);
const children = Array.from({ length: count }, (_, i) => ({ id: i }));

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    parent: {
      type: ParentType,
      resolve: () => ({
        id: "a",
        children
      })
    },
    children: {
      type: new GraphQLList(ChildType),
      resolve: () => children
    }
  }
});

const schema = new GraphQLSchema({ query: QueryType });

function delay(wait) {
  return new Promise((resolve) => setTimeout(resolve, wait));
}

export const link = new ApolloLink((operation) => {
  return new Observable(async (observer) => {
    const { query, operationName, variables } = operation;
    console.log("OBSERVING");
    await delay(1000);
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

const GET_PARENT = gql`
  query GetParent {
    parent {
      id
      children {
        id
      }
    }
  }
`;

const GET_CHILDREN = gql`
  query GetChildren {
    children {
      id
    }
  }
`;

function Children() {
  const { loading, data } = useQuery(GET_CHILDREN, {
    fetchPolicy: "cache-and-network"
  });
  if (loading) return <p>Loading children...</p>;

  return (
    <>
      <h2>Children</h2>
      <ul>
        <li># counts: {data.children.length}</li>
      </ul>
    </>
  );
}

function Parent() {
  const { loading, data } = useQuery(GET_PARENT, {
    fetchPolicy: "cache-first"
  });

  return (
    <main>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            <li key="id">ID: {data.parent.id}</li>
          </ul>
          <Children />
        </>
      )}
    </main>
  );
}

const cache = new InMemoryCache();

const client = new ApolloClient({ cache, link });

//render(
//  <ApolloProvider client={client}>
//    <Parent />
//  </ApolloProvider>,
//  document.getElementById("root"),
//);

render(
  <ApolloProvider client={client}>
    <Children />
  </ApolloProvider>,
  document.getElementById("root")
);
;
