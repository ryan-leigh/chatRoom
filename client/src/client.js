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
  link: splitLink,
  cache: new InMemoryCache({
    // addTypename: true,
    typePolicies: {
      Query: {
        fields: {
          getMessages: {
            keyArgs: ['id'],
            merge(existing, incoming) {
              if (existing === undefined) {
                return incoming;
              }
              return [...existing, ...incoming];
            }
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
  query GetRoom($id: ID!, $offset: Int!) {
    room(id: $id, offset: $offset) {
      id
      name
    }
  }
`;

export const READ_MESSAGES = gql`
  query ReadMessages($id: ID!) {
    getMessages(id: $id) {
      id
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($id: ID!, $offset: Int!) {
    getMessages(id: $id, offset: $offset) {
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
`

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
  mutation CreateMessage($userId: ID!, $roomId: ID!, $body: String, $timeCreated: Int) {
    createMessage(authorId: $userId, roomId: $roomId, body: $body, timeCreated: $timeCreated) {
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