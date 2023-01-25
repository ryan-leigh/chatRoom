const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const app = express();
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const server = new ApolloServer({ typeDefs, resolvers });

app.use(express.static(path.join(__dirname, '../../client/dist')));

const start = async () => {
  await server.start()
    .then(() => server.applyMiddleware({ app }));
}
start();

app.listen({ port: 3000 }, () =>
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`)
);