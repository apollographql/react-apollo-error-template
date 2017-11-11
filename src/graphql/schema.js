import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const PotatoeType = new GraphQLObjectType({
  name: 'Potatoe',
  fields: {
    id: { type: GraphQLID },
    type: { type: GraphQLString },
  },
});

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    potatoes: {
      type: new GraphQLList(PotatoeType),
    },
  },
});

const potatoes = [
  { id: 1, type: 'white' },
  { id: 2, type: 'brown' },
  { id: 3, type: 'yellow' },
  { id: 4, type: 'sweet' },
];

const peopleData = [
  { id: 1, name: 'John Smith', potatoes: [ potatoes[0], potatoes[1], potatoes[2], potatoes[3] ] },
  { id: 2, name: 'Sara Smith', potatoes: [], },
  { id: 3, name: 'Budd Deey', potatoes: [], },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType });
