require('dotenv').config()
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const app = express();
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const server = new ApolloServer({ typeDefs, resolvers });
const port = process.env.PORT;

const start = async () => {
  await server.start()
    .then(() => {
      app.use(express.static(path.join(__dirname, '../../client/dist')));
    })
    .then(() => {
      server.applyMiddleware({ app });
    })
    .then(() => {
      app.listen({ port }, () => {
        console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
      });
    });
}
start();
