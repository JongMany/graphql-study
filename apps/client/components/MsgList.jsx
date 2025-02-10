"use client";

import React, { useEffect, useRef, useState } from "react";
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import { fetcher, QueryKeys } from "../queryClient";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from "../graphql/messages";
// import useInfiniteScroll from "../hooks/useInfiniteScroll";

function MsgList() {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";

  const [editingId, setEditingId] = useState(null);
  // const fetchMoreEl = useRef(null);
  // const { intersecting } = useInfiniteScroll(fetchMoreEl);
  // const [hasNext, setHasNext] = useState(true);

  const queryClient = useQueryClient();
  const { users } = queryClient.getQueryData(QueryKeys.USERS);

  const { mutate: onCreate } = useMutation({
    mutationFn: ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    onSuccess: ({ createMessage }) => {
      queryClient.setQueryData(QueryKeys.MESSAGES, (prev) => {
        return {
          messages: [createMessage, ...prev.messages],
        };
      });
    },
  });

  const { data, isFetching, error, isError } = useQuery({
    queryKey: QueryKeys.MESSAGES,
    queryFn: () => fetcher(GET_MESSAGES),
  });

  if (isError) {
    return null;
  }

  const doneEdit = () => {
    setEditingId(null);
  };

  const { mutate: onUpdate } = useMutation({
    mutationFn: ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    onSuccess: ({ updateMessage }) => {
      queryClient.setQueryData(QueryKeys.MESSAGES, (prev) => {
        const targetIndex = prev.messages.findIndex(
          (msg) => msg.id === updateMessage.id
        );
        if (targetIndex === -1) return prev;
        const newMessages = [...prev.messages];
        newMessages.splice(targetIndex, 1, updateMessage);
        return {
          messages: newMessages,
        };
      });
      doneEdit();
    },
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    onSuccess: ({ deleteMessage: deletedId }) => {
      queryClient.setQueryData(QueryKeys.MESSAGES, (prev) => {
        const targetIndex = prev.messages.findIndex(
          (msg) => msg.id === deletedId
        );
        if (targetIndex === -1) return prev;
        const newMessages = [...prev.messages];
        newMessages.splice(targetIndex, 1);
        return {
          messages: newMessages,
        };
      });
    },
  });

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {data.messages.map((item) => (
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
            // user={users[item.userId]}
            user={users.find((x) => userId === x.id)}
          />
        ))}
      </ul>
      {/* <div ref={fetchMoreEl}></div> */}
    </>
  );
}

export default MsgList;
