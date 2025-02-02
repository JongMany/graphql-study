"use client";

import React, { useEffect, useState } from "react";
import MsgItem from "./MsgItem";

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
        timestamp: 1234567890123 + i * 1000 * 60,
        text: `${i + 1} mock text`,
      }));
    setMessages(msgs);
  }, []);

  return (
    <ul className="messages">
      {messages.reverse().map((item) => (
        <MsgItem {...item} />
      ))}
    </ul>
  );
}

export default MsgList;
