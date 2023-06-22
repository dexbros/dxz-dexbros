/** @format */

import ActionTypes from "./block.type";

export const setBlockCast = (data) => ({
  type: ActionTypes.SINGLE_BLOCK_CAST,
  data: data,
});

export const newMessages = (data) => ({
  type: ActionTypes.ADD_MESSAGE,
  data: data,
});

export const addMessage = (data) => ({
  type: ActionTypes.ADD_NEW_MESSAGE,
  data: data,
});

export const setPinnedMessage = (data) => ({
  type: ActionTypes.PINNED_MESSAGE,
  data: data,
});

export const setRemovePinnedMessage = (data) => ({
  type: ActionTypes.REMOVE_PINNED_MESSAGE,
  data: data,
});

export const removeMessage = (data) => ({
  type: ActionTypes.DELETE_MESSAGE,
  data: data,
});

export const addToLikeArray = (data) => ({
  type: ActionTypes.MESSAGE_LIKE,
  data: data,
});

export const removeToLikeArray = (data) => ({
  type: ActionTypes.MESSAGE_LIKE_REMOVE,
  data: data,
});

// *** Comments
export const newComments = (data) => ({
  type: ActionTypes.ADD_COMMENTS,
  data: data,
});

export const addComments = (data) => ({
  type: ActionTypes.ADD_NEW_COMMENTS,
  data: data,
});

export const addLikeComment = (data) => ({
  type: ActionTypes.ADD_COMMENT_LIKE,
  data: data,
});

export const addHeartComment = (data) => ({
  type: ActionTypes.ADD_COMMENT_HEART,
  data: data,
});

export const addIdeaComment = (data) => ({
  type: ActionTypes.ADD_COMMENT_IDEA,
  data: data,
});

export const addDislikeComment = (data) => ({
  type: ActionTypes.ADD_COMMENT_DISLIKE,
  data: data,
});

export const addFunnyComment = (data) => ({
  type: ActionTypes.ADD_COMMENT_FUNNY,
  data: data,
});

export const updatBlockCast = (data) => ({
  type: ActionTypes.UPDATE_BLOCKCAST,
  data: data,
});

export const joinBlockcast = (data) => ({
  type: ActionTypes.JOIN_BLOCK,
  data: data,
});

export const removeBlockCast = (data) => ({
  type: ActionTypes.REMOVE_BLOCK,
  data: data,
});

export const selectBlockcast = (data) => ({
  type: ActionTypes.SELECT_BLOCK,
  data: data,
});

export const unselectBlockcast = (data) => ({
  type: ActionTypes.UNSELECT_BLOCK,
  data: data,
});
