const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    "Get message objects for all messages sent by a specific user"
    user(id: ID!): User!
    room(id: ID!): Room!
  }

  type Mutation {
    createUser(username: String!, email: String!, updated_at: Int!): CreateUserResponse!
    createMessage(userId: ID!, roomId: ID!, body: String, timeCreated: Int): CreateMessageResponse!
  }

  type Subscription {
    "Get message objects from a specific room"
    newMessage(roomId: ID!): NewMessage!
  }

  "PRIMARY TYPES"
  type Room {
    id: ID!
    name: String!
    messages: [Message!]!
  }

  type User {
    id: ID!
    name: String!
    email: String
    updated_at: Int
  }

  type Message {
    id: ID!
    body: String
    time_created: Int!
    author: User
  }

  type NewMessage {
    id: ID!
    body: String
    time_created: Int!
    author_id: ID!
    author_name: String!
    author_email: String
    author_updated_at: Int
  }

  "MUTATION RESPONSES"
  type CreateUserResponse {
    code: Int!
    success: Boolean!
    message: String!
    uniqueIssue: Boolean
    newUser: User
  }

  type CreateMessageResponse {
    code: Int!
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs;
