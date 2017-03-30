import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const random = items => items[Math.floor(Math.random() * items.length)];

const BelongingsType = new GraphQLObjectType({
  name: 'Belonging',
  fields: {
    id: { type: GraphQLID },
    label: { type: GraphQLString },
  },
});

const belongingData = [
  { id: 1, label: 'Red toy' },
  { id: 2, label: 'Blanket' },
  { id: 3, label: 'Leash' },
];

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    belonging: {
      type: BelongingsType,
      resolve: () => random(belongingData),
    },
  },
});

const petData = [
  { id: 1, name: 'Buddy' },
  { id: 2, name: 'Spots' },
  { id: 3, name: 'Lassy' },
];

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pets: {
      type: new GraphQLList(PetType),
      resolve: () => petData,
    },
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
      resolve: () => peopleData,
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType });
