import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const foodData = [
  { id: 1, name: 'Burritos' },
  { id: 2, name: 'Pizza' },
  { id: 3, name: 'Sushi' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => {
          console.log("SERVER TRIP for people.");
          console.log(peopleData);
          return peopleData;
      }
    },
    food: {
      type: new GraphQLList(PersonType),
      resolve: () => {
          console.log("SERVER TRIP for food.");
          console.log(foodData);
          return foodData;
      }
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType });
