import { ApolloClient, InMemoryCache, makeVar, gql } from '@apollo/client';

export const currentUser = makeVar(1);
export const currentPage = makeVar('login');

export const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});
