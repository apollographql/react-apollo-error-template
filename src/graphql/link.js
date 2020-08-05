import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { schema } from "./schema";

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

const people = [
  { __typename: "Person", id: 1, name: 'John Smith', friends: [] },
  { __typename: "Person", id: 2, name: 'Sara Smith', friends: [] },
  { __typename: "Person", id: 3, name: 'Budd Deey', friends: [] },
];

const addFriend = {
  __typename: "Person",
  id: 4,
  name: "Hello Friend",
  friends: [],
};

export const link = new ApolloLink(operation => {
  return new Observable(observer => {
    const { query, operationName, variables } = operation;
    delay(300)
      // .then(() =>
      //   graphql(schema, print(query), null, null, variables, operationName)
      // )
      .then(result => {
        if (operationName === "AllPeople") {
          const response = { data: { people } }
          observer.next(response);
          observer.complete();
        }

        if (operationName === "AddFriend") {
          const response = { data: { addFriend } };
          observer.next(response);
          observer.complete();
        }
      })
      .catch(observer.error.bind(observer));
  });
});
