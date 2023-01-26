const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    "Get message objects from a specific room"
    messagesForRoom(id: ID!): [Message!]!
    "Get message objects for all messages sent by a specific user"
    messagesForUser(id: ID!): [Message!]!

  }

  type Room {
    id: ID!
    name: String!
  }

  type Message {
    id: ID!
    userId: ID!
    roomId: ID!
    body: String
    timeCreated: Int
  }
`;

module.exports = typeDefs;
