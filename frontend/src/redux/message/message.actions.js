import ActionTypes from './message.types';

export const saveMessage = (data) => ({
  type: ActionTypes.SAVE_MESSAGE,
  data: data,
});

export const removeMessage = (data) => ({
  type: ActionTypes.REMOVE_MESSAGE,
  data: data,
});

export const deleteMessage = (data) => ({
  type: ActionTypes.DELETE_MESSAGE,
  data: data,
});

export const likeMessage = (data) => ({
  type: ActionTypes.LIKE_MESSAGE,
  data: data,
});

export const removeLikeMessage = (data) => ({
  type: ActionTypes.REMOVE_LIKE_MESSAGE,
  data: data,
});

export const updateMessage = (data) => ({
  type: ActionTypes.UPDATE_MESSAGE,
  data: data,
});