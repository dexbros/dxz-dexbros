/** @format */

import ActionTypes from "./groupPost.types";

export const setNewPinnedPost = (post) => ({
  type: ActionTypes.SET_PINNED_POST,
  post: post,
});

export const groupNewPosts = (data) => ({
  type: ActionTypes.GROUP_NEW_POSTS,
  data: data,
});

export const groupPutPostsLast = (data) => ({
  type: ActionTypes.GROUP_PUT_POSTS_LAST,
  data: data,
});

export const addNewPost = (data) => ({
  type: ActionTypes.ADD_NEW_POST,
  post: data,
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

// export const addEvents = (post) => ({
//   type: ActionTypes.ADD_EVENT,
//   post: post,
// });
export const addNewEvents = (post) => ({
  type: ActionTypes.ADD_NEW_EVENT,
  post: post,
});
export const remmoveEvent = (post) => ({
  type: ActionTypes.REMOVE_EVENT,
  post: post,
});

// *** group post spam
export const addGroupPostSpam = (data) => ({
  type: ActionTypes.ADD_GROUP_POST_SPAM,
  data: data,
});

// *** ADD GROUP POST
export const addGroupPost = (data) => ({
  type: ActionTypes.ADD_GROUP_POST,
  data: data,
});

// **** ADD NEW REDUX STATE **** //
export const setGroupPosts = (data) => ({
  type: ActionTypes.SET_GROUP_POSTS,
  data: data,
});

export const appendSinglePost = (data) => ({
  type: ActionTypes.APPEND_SINGLE_POST,
  data: data,
});

export const appendGroupPost = (data) => ({
  type: ActionTypes.APPEND_GROUP_POSTS,
  data: data,
});

/**
 * EVENTS
 */
export const addEvents = (data) => ({
  type: ActionTypes.ADD_EVENTS,
  data: data,
});

export const addEventFirst = (data) => ({
  type: ActionTypes.ADD_EVENTS,
  data: data,
});

export const updateGroupPost = (data) => ({
  type: ActionTypes.UPDATE_GROUP_POST,
  data: data,
});
