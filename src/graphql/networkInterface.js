import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client'

export const networkInterface = createBatchingNetworkInterface({
  uri: 'http://159.203.96.223/graphql',
  batchInterval: 10,
})
