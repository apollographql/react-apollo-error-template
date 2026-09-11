import type { Resolvers } from "./types/__generated__/resolvers";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql?raw";

const peopleData = [
  { id: 1, name: "John Smith" },
  { id: 2, name: "Sara Smith" },
  { id: 3, name: "Budd Deey" },
];

const resolvers: Resolvers = {
  Query: {
    people: () => {
      return peopleData.map((person) => ({ ...person, id: String(person.id) }));
    },
  },
  Mutation: {
    addPerson: (_, { name }) => {
      const person = {
        id: peopleData[peopleData.length - 1].id + 1,
        name,
      };

      peopleData.push(person);
      return { ...person, id: String(person.id) };
    },
  },
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });
