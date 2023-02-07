import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, makeVar, gql } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Create links for WS and HTTP
// const httpLink = new HttpLink({
//   uri: 'http://localhost:3000/graphql'
// });
// const wsLink = new GraphQLWsLink(createClient({
//   url: 'ws://localhost:3000/graphql',
// }));
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === 'OperationDefinition' &&
//       definition.operation === 'subscription'
//     );
//   },
//   wsLink,
//   httpLink,
// );

// Client
export const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

// Variables
export const currentUser = makeVar(1);
export const currentPage = makeVar('login');

// Queries
export const GET_ROOM = gql`
  query GetRoom($roomId: ID!) {
    room(id: $roomId) {
      name
      messages {
        id
        body
        time_created
        author {
          id
          name
          email
          updated_at
        }
      }
    }
  }
`;

// Mutations

// Subscriptions
export const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageCreated($roomId: ID!) {
    newMessage (roomId: $roomId) {
      id
      body
      time_created
      author_id
      author_name
      author_email
    }
  }
`;