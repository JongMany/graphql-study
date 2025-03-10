import { readDB, writeDB } from "../dbController.js";
import { v4 } from "uuid";

const getMessages = () => {
  const messages = readDB("messages");
  return messages;
};
const setMessages = (data) => {
  writeDB("messages", data);
};

const messagesRoutes = [
  {
    method: "get",
    route: "/messages",
    handler: (req, res) => {
      const {
        query: { cursor = "" },
      } = req;

      const messages = getMessages();
      const fromIndex = messages.findIndex((msg) => msg.id === cursor) + 1;
      const paginatedMessages = messages.slice(fromIndex, fromIndex + 15);
      res.send(paginatedMessages);
    },
  },
  {
    method: "get",
    route: "/messages/:id",
    handler: (req, res) => {
      try {
        const {
          params: { id },
        } = req;

        const messages = getMessages();
        const targetMessage = messages.find((item) => item.id === id);
        if (!targetMessage) {
          throw new Error("Not found");
        }

        res.send(targetMessage);
      } catch (error) {
        res.status(404).send({ message: error });
      }
    },
  },
  {
    method: "post",
    route: "/messages",
    handler: (req, res) => {
      const { body } = req;
      if (!body.text || !body.userId) {
        return res.status(400).send({ message: "Invalid request" });
      }

      const messages = getMessages();
      const newMessage = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now(),
      };
      messages.unshift(newMessage);
      setMessages(messages);

      res.send(newMessage);
    },
  },
  {
    method: "put",
    route: "/messages/:id",
    handler: (req, res) => {
      try {
        const {
          body,
          params: { id },
        } = req;
        if (!body.text || !body.userId) {
          return res.status(400).send({ message: "Invalid request" });
        }

        const messages = getMessages();
        const targetIndex = messages.findIndex((item) => item.id === id);

        if (targetIndex === -1) {
          throw new Error("Not found");
        }
        if (messages[targetIndex].userId !== body.userId) {
          throw new Error("Unauthorized");
        }
        const newMessages = { ...messages[targetIndex], text: body.text };
        messages[targetIndex] = newMessages;

        setMessages(messages);
        res.send(newMessages);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
      }
    },
  },
  {
    method: "delete",
    route: "/messages/:id",
    handler: (req, res) => {
      try {
        const {
          query: { userId },
          params: { id },
        } = req;

        const messages = getMessages();
        const targetIndex = messages.findIndex((item) => item.id === id);

        if (targetIndex === -1) {
          throw new Error("Not found");
        }
        if (messages[targetIndex].userId !== userId) {
          throw new Error("Unauthorized");
        }
        messages.splice(targetIndex, 1);
        setMessages(messages);
        res.send({ id });
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: error });
      }
    },
  },
];

export default messagesRoutes;
