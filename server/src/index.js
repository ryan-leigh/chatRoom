require('dotenv').config()
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require('path');
const app = express();
const MyDatabase = require('./datasources/db.js');
const knexConfig = {
  client: "postgres",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    username: process.env.PGUSERNAME,
    password: process.env.PGPASSWORD
  }
}
const db = new MyDatabase(knexConfig);
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({ db })
});
const port = process.env.PORT;

const start = async () => {
  await apolloServer.start()
    .then(() => {
      app.use(express.static(path.join(__dirname, '../../client/dist')));
    })
    .then(() => {
      apolloServer.applyMiddleware({ app });
    })
    .then(() => {
      app.listen({ port }, () => {
        console.log(`🚀 Server ready at http://localhost:3000${apolloServer.graphqlPath}`);
      });
    });
}
start();
