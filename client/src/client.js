import { ApolloClient, InMemoryCache, makeVar, gql } from '@apollo/client';

export const currentUserVar = makeVar(1);

export const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});
