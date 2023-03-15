import { ApolloClient, InMemoryCache, ApolloLink, split, HttpLink, makeVar, gql } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

//Create links for WS and HTTP
const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql'
});
const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:3000/graphql',
}));
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

// Client
export const client = new ApolloClient({
  // uri: 'http://localhost:3000/graphql',
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          room: {
            keyArgs: ['id']
          }
        }
      }
    }
  })
});

// Variables
export const currentUser = makeVar(1);
export const currentPage = makeVar('login');

// Queries
export const GET_ROOM = gql`
  query GetRoom($id: ID!) {
    room(id: $id) {
      id
      name
      messages {
        id
        body
        time_created
        author {
          id
          name
          updated_at
        }
      }
    }
  }
`;

// export const GET_MORE_MESSAGES = gql`
//   query GetMoreMessages($id: ID!, $offset: Int!) {
//     messages(id: $id, offset: $offset) {
//       id
//       body
//       time_created
//       author {
//         id
//         name
//         updated_at
//       }
//     }
//   }
// `

// Mutations
export const CREATE_USER = gql`
  mutation Mutation($username: String!, $updatedAt: Int!) {
    createUser(username: $username, updated_at: $updatedAt) {
      code
      success
      message
      uniqueIssue
      newUser {
        id
        name
        updated_at
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($authorId: ID!, $roomId: ID!, $body: String, $timeCreated: Int) {
    createMessage(authorId: $authorId, roomId: $roomId, body: $body, timeCreated: $timeCreated) {
      code
      success
      message
      newMessage {
        body
        time_created
        author {
          id
          name
          updated_at
        }
        id
      }
    }
  }
`;

// Subscriptions
export const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageCreated($roomId: ID!) {
    newMessage (roomId: $roomId) {
      id
      body
      time_created
      author {
        id
        name
        updated_at
      }
    }
  }
`;