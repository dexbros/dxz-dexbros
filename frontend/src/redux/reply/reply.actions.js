/** @format */

import ActionTypes from "./reply.types";

export const updateReply = (data) => ({
  type: ActionTypes.UPDATE_REPLY,
  reply: data,
});

export const deleteReply = (data) => ({
  type: ActionTypes.DELETE_REPLY,
  reply: data,
});

export const removeAllReply = (data) => ({
  type: ActionTypes.REMOVE_ALL_REPLY,
  reply: data,
});

export const putReplyLast = (data) => ({
  type: ActionTypes.ADD_NEW_REPLY,
  reply: data,
});

// new added

export const setReplies = (data) => ({
  type: ActionTypes.SET_REPLIES,
  data: data,
});

export const addNewReply = (data) => ({
  type: ActionTypes.NEW_REPLY,
  reply: data,
});
