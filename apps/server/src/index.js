import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import resolvers from "./resolvers/index.js";
import schema from "./schema/index.js";
import { readDB } from "./dbController.js";

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// messagesRoutes.forEach((route) => {
//   app[route.method](route.route, route.handler);
// });

// usersRoutes.forEach((route) => {
//   app[route.method](route.route, route.handler);
// });

async function startGraphqlServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      db: {
        messages: readDB("messages"),
        users: readDB("users"),
      },
    },
  });
  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: {
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    },
  });

  app.listen(8000, () => {
    console.log("Server started at http://localhost:8000");
  });
}

startGraphqlServer()
  .then(() => {
    console.log("Graphql server is running...");
  })
  .catch((error) => {
    console.error("Error starting GraphQL server:", error);
    process.exit(1);
  });
