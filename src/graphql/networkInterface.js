import { graphql, print } from 'graphql';
import { schema } from './schema';

export const networkInterface = {
  query({ query, variables, operationName }) {
    return graphql(
      schema,
      print(query),
      null,
      null,
      variables,
      operationName,
    );
  },
};
