/*** LINK ***/
import { graphql, print } from "graphql";
import { ApolloLink, Observable } from "@apollo/client";
import { schema } from "./schema.js";

function delay(wait) {
  return new Promise(resolve => setTimeout(resolve, wait));
}

export const link = new ApolloLink(operation => {
  return new Observable(async observer => {
    const { query, operationName, variables } = operation;
    await delay(300);
    try {
      const result = await graphql({
        schema,
        source: print(query),
        variableValues: variables,
        operationName,
      });
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});
