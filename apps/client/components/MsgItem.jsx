import React from "react";
import MsgInput from "./MsgInput";

export default function MsgItem({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  onDelete,
  startEdit,
  isEditing,
  myId,
  user,
}) {
  return (
    <li className="messages__item">
      <h3>
        {user?.nickname}{" "}
        <sub>
          {new Date(timestamp).toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </sub>
      </h3>

      {isEditing ? (
        <>
          <MsgInput id={id} mutate={onUpdate} text={text} />
        </>
      ) : (
        text
      )}
      {myId === userId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
}
