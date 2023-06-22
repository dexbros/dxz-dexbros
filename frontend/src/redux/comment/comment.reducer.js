/** @format */

import ActionTypes from "./comment.types";

const INITIAL_STATE = {
  comments: [],
  updateComment: null,
};

export const commentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Update comment
    case ActionTypes.UPDATE_COMMENT:
      return {
        ...state,
        updateComment: action.comment,
      };
      break;

    // Put comment last
    case ActionTypes.ADD_NEW_COMMENT:
      return {
        ...state,
        comments: [...state.comments, action.comment],
      };
      break;

    // Add new comment
    case ActionTypes.NEW_COMMENT:
      return {
        ...state,
        comments: [...state.comments, ...action.comment],
      };
      break;

    // Delete comment
    case ActionTypes.DELETE_COMMENT:
      var temp = state.comments;
      const newComments = temp.filter((p) => p._id != action.comment.id);
      return {
        ...state,
        comments: newComments,
      };
      break;

    case ActionTypes.REMOVE_ALL_COMMENTS:
      {
        return {
          comments: [],
        };
      }
      break;

    case ActionTypes.SET_COMMENT:
      return {
        ...state,
        comments: action.comment,
      };
      break;

    case ActionTypes.ADD_NEW_COMMENT_FIRST:
      return {
        ...state,
        comments: [action.comment, ...state.comments],
      };
    default:
      return state;
  }
};
