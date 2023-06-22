import ActionTypes from "./comment.types";

export const addNewComment = (data) => ({
  type: ActionTypes.ADD_COMMENT,
  comments: data,
});

export const addBookmarkComment = (data) => ({
  type: ActionTypes.ADD_BOOKMARK,
  bookmarks: data
});

export const addPinComment = (data) => ({
  type: ActionTypes.ADD_PIN,
  pin: data
});

export const addLikeComment = (data) => ({
  type: ActionTypes.ADD_LIKE,
  likes: data,
});

export const addSpamComment = (data) => ({
  type: ActionTypes.ADD_SPAM,
  spams: data
});

export const deleteComment = (data) => ({
  type: ActionTypes.DELETE_COMMENT,
  comment: data
})

export const selectPost = (data) => ({
    type: ActionTypes.SELECT_POST,
    data: data
}) 