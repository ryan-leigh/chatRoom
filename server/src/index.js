require('dotenv').config()
const MyDatabase = require('./datasources/db.js');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const express = require('express');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server-express');
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Set up data sources
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

// Create servers
const port = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const apolloServer = new ApolloServer({
  schema,
  dataSources: () => ({ db }),
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ]
});
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});
const serverCleanup = useServer({ schema }, wsServer);

// Start servers
const start = async () => {
  await apolloServer.start()
    .then(() => {
      app.use(express.static(path.join(__dirname, '../../client/dist')));
    })
    .then(() => {
      apolloServer.applyMiddleware({ app });
    })
    .then(() => {
      httpServer.listen({ port }, () => {
        console.log(`🚀 Server ready at http://localhost:3000${apolloServer.graphqlPath}`);
      });
    });
}
start();
