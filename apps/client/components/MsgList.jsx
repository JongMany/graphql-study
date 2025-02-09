"use client";

import React, { useEffect, useRef, useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { fetcher } from "../fetcher";
import { useRouter } from "next/router";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

function MsgList({ messagesFromServer, users }) {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  const [messages, setMessages] = useState(messagesFromServer);
  const [editingId, setEditingId] = useState(null);
  const fetchMoreEl = useRef(null);
  const { intersecting } = useInfiniteScroll(fetchMoreEl);
  const [hasNext, setHasNext] = useState(true);

  const getMessages = async () => {
    const newMessages = await fetcher("get", "messages", {
      searchParams: { cursor: messages[messages.length - 1]?.id || "" },
    });
    if (newMessages.length === 0) {
      setHasNext(false);
      return;
    }
    setMessages((prev) => [...prev, ...newMessages]);
  };

  useEffect(() => {
    if (intersecting && hasNext) {
      getMessages();
    }
  }, [intersecting]);

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
            user={users[item.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
}

export default MsgList;
