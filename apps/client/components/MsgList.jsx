"use client";

import React, { useEffect, useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { fetcher } from "../fetcher";
import { useRouter } from "next/router";

function MsgList() {
  const {
    query: { userId = "" },
  } = useRouter();
  const [messages, setMessages] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const getMessages = async () => {
    const messagesFromServer = await fetcher("get", "messages");
    setMessages(messagesFromServer);
  };

  useEffect(() => {
    getMessages();
  }, []);

  const onCreate = async (text) => {
    const newMessage = await fetcher("post", "messages", {
      json: { text, userId },
    });
    // const newMessage = {
    //   id: messages.length + 1,
    //   userId: getRandomUserIds(),
    //   timestamp: Date.now(),
    //   text: `${messages.length + 1} ${text}`,
    // };
    setMessages([newMessage, ...messages]);
  };

  const doneEdit = () => {
    setEditingId(null);
  };
  const onUpdate = (text, id) => {
    setMessages((prev) => {
      const targetIndex = messages.findIndex((msg) => msg.id === id);
      if (targetIndex === -1) return prev;
      return [
        ...prev.slice(0, targetIndex),
        { ...prev[targetIndex], text },
        ...prev.slice(targetIndex + 1),
      ];
    });
    doneEdit();
  };

  const onDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {messages.map((item) => (
          <MsgItem
            key={item.id}
            {...item}
            onUpdate={onUpdate}
            startEdit={() => {
              setEditingId(item.id);
            }}
            isEditing={editingId === item.id}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </ul>
    </>
  );
}

export default MsgList;
