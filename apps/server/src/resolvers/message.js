import { writeDB } from "../dbController.js";
import { v4 } from "uuid";

const setMessages = (data) => {
  writeDB("messages", data);
};

/**
 * parent: parent 객체
 * args: Query에 필요한 필드에 제공되는 인수(parameter)
 * context: 로그인한 사용자. DB Access 등 중요한 정보
 */
const messageResolver = {
  Query: {
    messages: (parent, args, context) => {
      const { db } = context;
      console.log(db.messages);
      return db.messages;
    },
    message: (parent, args, context) => {
      const { id = "" } = args;
      const { db } = context;
      const targetMessage = db.messages.find((item) => item.id === id);
      return targetMessage;
    },
  },
  Mutation: {
    createMessage: (parent, args, context) => {
      const { text, userId } = args;
      const { db } = context;
      if (!text || !userId) {
        throw new Error("Invalid request");
      }
      const newMessage = {
        id: v4(),
        text: text,
        userId: userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMessage);
      setMessages(db.messages);
      return newMessage;
    },
    updateMessage: (parent, args, context) => {
      const { id, text, userId } = args;
      const { db } = context;

      const targetIndex = db.messages.findIndex((item) => item.id === id);

      if (targetIndex === -1) {
        throw new Error("Not found");
      }
      if (db.messages[targetIndex].userId !== userId) {
        throw new Error("Unauthorized");
      }
      const newMessages = { ...db.messages[targetIndex], text: text };
      db.messages[targetIndex] = newMessages;

      setMessages(db.messages);
      return newMessages;
    },
    deleteMessage: (parent, args, context) => {
      const { id, userId } = args;
      const { db } = context;

      const targetIndex = db.messages.findIndex((item) => item.id === id);

      if (targetIndex === -1) {
        throw new Error("Not found");
      }
      if (db.messages[targetIndex].userId !== userId) {
        throw new Error("Unauthorized");
      }
      db.messages.splice(targetIndex, 1);
      setMessages(db.messages);
      return id;
    },
  },
};

export default messageResolver;
