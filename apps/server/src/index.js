import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import messagesRoutes from "./routes/messages.js";
import usersRoutes from "./routes/users.js";

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// messagesRoutes.forEach((route) => {
//   app[route.method](route.route, route.handler);
// });

// usersRoutes.forEach((route) => {
//   app[route.method](route.route, route.handler);
// });
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models: {
      messages: "",
      users: "",
    },
  },
});

server.applyMiddleware({ app, path: "/graphql" });

app.listen(8000, () => {
  console.log("Server started at http://localhost:8000");
});
