/** @format */

import ActionTypes from "./reply.types";

const INITIAL_STATE = {
  replies: [],
  updateReply: null,
};

export const replyReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Update comment
    case ActionTypes.UPDATE_REPLY:
      return {
        ...state,
        updateReply: action.reply,
      };
      break;

    // Put comment last
    case ActionTypes.ADD_NEW_REPLY:
      return {
        ...state,
        replies: [...state.replies, action.reply],
      };
      break;

    // Add new comment
    case ActionTypes.NEW_REPLY:
      return {
        ...state,
        replies: [...state.replies, ...action.reply],
      };
      break;

    // Delete comment
    case ActionTypes.DELETE_COMMENT:
      var temp = state.comments;
      const newReplies = temp.filter((p) => p._id != action.reply.id);
      return {
        ...state,
        replies: newReplies,
      };
      break;

    case ActionTypes.REMOVE_ALL_REPLY: {
      return {
        replies: [],
      };
    }

    case ActionTypes.SET_REPLIES:
      {
        return {
          ...state,
          replies: action.data,
        };
      }
      break;

    case ActionTypes.ADD_REPLIES: {
      return {
        ...state,
        replies: [...state.replies, ...action.data],
      };
    }

    default:
      return state;
  }
};
