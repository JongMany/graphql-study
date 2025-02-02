import React from "react";
import MsgItem from "./MsgItem";

const userIds = ["roy", "jay"];
const getRandomUserIds = () => userIds[Math.round(Math.random())];

const msgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    userId: getRandomUserIds(),
    timestamp: 1234567890123 + i * 1000 * 60,
    text: `${i + 1} mock text`,
  }));

function MsgList() {
  return (
    <ul className="messages">
      {msgs.reverse().map((item) => (
        <MsgItem {...item} />
      ))}
    </ul>
  );
}

export default MsgList;
