const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    "Get message objects for all messages sent by a specific user"
    user(id: ID!): User!
    room(id: ID!): Room!
  }

  type Mutation {
    createMessage(roomId: ID!): CreateMessageResponse!
  }

  type Subscription {
    "Get message objects from a specific room"
    messagesForRoom(id: ID!): [Message!]!
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
    updatedAt: Int
  }

  type Message {
    id: ID!
    body: String
    timeCreated: Int
  }

  "MUTATION RESPONSES"
  type CreateMessageResponse {
    code: Int!
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs;
