import { gql } from "apollo-server-express";

const messageSchema = gql`
  type Message {
    id: ID! # 고유값(uuid)
    text: String!
    userId: ID!
    timestamp: Float # 13자리 숫자 String!
  }

  extend type Query {
    # messages(cursor: ID): [Message!]!
    messages: [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessage(text: String!, userId: ID!): Message!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userId: ID!): ID!
  }
`;

export default messageSchema;
