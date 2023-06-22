/** @format */

import ActionTypes from "./post.types";

const INITIAL_STATE = {
  posts: [],
  pinnedPost: null,
  comments: [],
  selectComment: null,
  selectedPost: null,
  notificationPost: [],
};

export const postReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SET_PINNED_POST:
      return {
        ...state,
        pinnedPost: action.post,
      };
      break;
    case ActionTypes.NEW_POSTS:
      return {
        ...state,
        posts: action.posts,
      };
      break;
    case ActionTypes.PUT_POSTS_LAST:
      return {
        ...state,
        posts: [...action.posts, ...state.posts],
      };
      break;
    case ActionTypes.PUT_POSTS:
      return {
        ...state,
        posts: [...action.posts, ...state.posts],
      };
      break;
    case ActionTypes.UPDATE_POST:
      var postsCopy = [...state.posts];
      const index = postsCopy.findIndex((p) => p._id === action.post._id);
      postsCopy[index] = action.post;
      return {
        ...state,
        posts: postsCopy,
      };
      break;
    case ActionTypes.DELETE_POST:
      var postsCopy = state.posts;
      const newPosts = postsCopy.filter((p) => p._id != action.post._id);
      return {
        ...state,
        posts: newPosts,
      };
      break;

    // *** Comment *** //
    case ActionTypes.ADD_COMMENTS:
      // console.log(action)
      return {
        ...state,
        comments: [...state.comments, ...action.data],
      };
      break;

    case ActionTypes.UPDATE_COMMENT:
      return {
        ...state,
        selectComment: action.data,
      };
      break;

    case ActionTypes.SELECT_POST:
      return {
        ...state,
        selectedPost: action.data,
      };

    case ActionTypes.REMOVE_POSTS:
      return {
        ...state,
        posts: [],
      };

    case ActionTypes.ADD_NOTOFICATION_POST:
      return {
        ...state,
        notificationPost: [action.data, ...state.notificationPost],
      };
      break;

    case ActionTypes.REMOVE_NOTIFICATION_POST: {
      return {
        ...state,
        notificationPost: [],
      };
    }

    default:
      return state;
  }
};
