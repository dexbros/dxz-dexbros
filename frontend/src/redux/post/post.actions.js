/** @format */

import ActionTypes from "./post.types";

export const setNewPinnedPost = (post) => ({
  type: ActionTypes.SET_PINNED_POST,
  post: post,
});

export const newPosts = (posts) => ({
  type: ActionTypes.NEW_POSTS,
  posts: posts,
});

export const putPostsLast = (posts) => ({
  type: ActionTypes.PUT_POSTS_LAST,
  posts: posts,
});

export const putPosts = (posts) => ({
  type: ActionTypes.PUT_POSTS,
  posts: posts,
});

export const updatePost = (post) => ({
  type: ActionTypes.UPDATE_POST,
  post: post,
});

export const deletePost = (post) => ({
  type: ActionTypes.DELETE_POST,
  post: post,
});

export const newComments = (data) => ({
  type: ActionTypes.ADD_COMMENTS,
  data: data,
});

export const updateComments = (data) => ({
  type: ActionTypes.UPDATE_COMMENT,
  data: data,
});

export const selectPost = (data) => ({
  type: ActionTypes.SELECT_POST,
  data: data,
});

export const removeAllPosts = (data) => ({
  type: ActionTypes.REMOVE_POSTS,
  data: data,
});

export const addNotificationPost = (data) => ({
  type: ActionTypes.ADD_NOTOFICATION_POST,
  data: data,
});

export const removeNotificationPost = (data) => ({
  type: ActionTypes.REMOVE_NOTIFICATION_POST,
  data: data,
});
