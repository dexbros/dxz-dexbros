/** @format */

import ActionTypes from "./comment.types";

export const addNewComment = (data) => ({
  type: ActionTypes.SET_COMMENT,
  comment: data,
});

export const updateComment = (data) => ({
  type: ActionTypes.UPDATE_COMMENT,
  comment: data,
});

export const deleteComment = (data) => ({
  type: ActionTypes.DELETE_COMMENT,
  comment: data,
});

export const removeAllComments = (data) => ({
  type: ActionTypes.REMOVE_ALL_COMMENTS,
  comment: data,
});

export const putCommentLast = (data) => ({
  type: ActionTypes.ADD_NEW_COMMENT,
  comment: data,
});

export const setComments = (data) => ({
  type: ActionTypes.ADD_NEW_COMMENT,
  comment: data,
});

export const addCommentFirst = (data) => ({
  type: ActionTypes.ADD_NEW_COMMENT_FIRST,
  comment: data,
});
