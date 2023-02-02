import { ApolloClient, InMemoryCache, makeVar, gql } from '@apollo/client';

// Client
export const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

// Variables
export const currentUser = makeVar(1);
export const currentPage = makeVar('login');

// Queries
export const GET_ROOM_MESSAGES = gql`
  query getRoomMessages {
    room {
      messages {
        id
        body
        timeCreated
        author {
          name
        }
      }
    }
  }
`;

// Mutations
