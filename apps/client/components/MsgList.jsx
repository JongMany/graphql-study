"use client";

import React, { useEffect, useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { fetcher } from "../fetcher";
import { useRouter } from "next/router";

function MsgList() {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
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
    if (!newMessage) return;

    setMessages([newMessage, ...messages]);
  };

  const doneEdit = () => {
    setEditingId(null);
  };
  const onUpdate = async (text, id) => {
    const newMessage = await fetcher("put", `messages/${id}`, {
      json: { text, userId },
    });
    if (!newMessage) return;

    setMessages((prev) => {
      const targetIndex = messages.findIndex((msg) => msg.id === id);
      if (targetIndex === -1) return prev;
      return [
        ...prev.slice(0, targetIndex),
        { ...newMessage },
        ...prev.slice(targetIndex + 1),
      ];
    });
    doneEdit();
  };

  const onDelete = async (id) => {
    console.log(id, messages);

    const { id: removedId } = await fetcher(
      "delete",
      `messages/${id}?userId=${userId}`
    );
    setMessages((prev) => prev.filter((msg) => msg.id !== `${removedId}`));
  };

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
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
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
}

export default MsgList;
