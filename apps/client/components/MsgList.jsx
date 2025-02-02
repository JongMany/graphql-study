"use client";

import React, { useEffect, useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";

const userIds = ["roy", "jay"];
const getRandomUserIds = () => userIds[Math.round(Math.random())];

function MsgList() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const msgs = Array(50)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        userId: getRandomUserIds(),
        timestamp: 1234567890123 + i * 17000000 * 600,
        text: `${i + 1} mock text`,
      }))
      .reverse();
    setMessages(msgs);
  }, []);

  const onCreate = (text) => {
    const newMessage = {
      id: messages.length + 1,
      userId: getRandomUserIds(),
      timestamp: Date.now(),
      text: `${messages.length + 1} ${text}`,
    };
    setMessages([newMessage, ...messages]);
  };

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="messages">
        {messages.map((item) => (
          <MsgItem {...item} />
        ))}
      </ul>
    </>
  );
}

export default MsgList;
