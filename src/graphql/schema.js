import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    friends: { type: new GraphQLList(PersonType) },
  }),
});

const peopleData = [
  { id: 1, name: 'John Smith', friends: [] },
  { id: 2, name: 'Sara Smith', friends: [] },
  { id: 3, name: 'Budd Deey', friends: [] },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => {
        return peopleData;
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: { 
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: ++peopleData[peopleData.length - 1].id,
          name,
          friends: [],
        };

        peopleData.push(person);
        return person;
      }
    },
    addFriend: {
      type: PersonType,
      args: {
        id: { type: GraphQLID },
        friendId: { type: GraphQLID },
      },
      resolve: (_, args) => {
        const friend = peopleData.find(person => person.id === parseInt(args.friendId, 10));

        // for (const person of peopleData) {
        //   if (person.id === parseInt(args.id, 10)) {
        //     person.friends = [...person.friends, friend];
        //     friend.friends = [...friend.friends, person];
        //     break;
        //   }
        // }

        return friend;
      },
    },
  },
});

export const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });
