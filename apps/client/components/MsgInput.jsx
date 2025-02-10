"use client";
import React, { useRef } from "react";

export default function MsgInput({ mutate, id = undefined, text }) {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault(); //
    e.stopPropagation();

    const text = textRef.current.value.trim();

    mutate({ text, id });
    // Initialize the text
    textRef.current.value = "";
  };

  return (
    <form className="messages__input" onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        placeholder="내용을 입력하세요."
        defaultValue={text}
      />
      <button type="submit">완료</button>
    </form>
  );
}
