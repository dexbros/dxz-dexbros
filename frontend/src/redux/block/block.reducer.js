/** @format */

import ActionTypes from "./block.type";

const INTITIAL_STATE = {
  messages: [],
  blockCast: null,
  pinnedMessage: [],
  comments: [],
  updatedBlock: null,
  like: [],
  heart: [],
  idea: [],
  dislike: [],
  funny: [],

  join: [],
  selectBlock: null,
};

export const blockCastReducer = (state = INTITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.SINGLE_BLOCK_CAST: {
      return {
        ...state,
        blockCast: action.data,
      };
      break;
    }

    case ActionTypes.UPDATE_BLOCKCAST: {
      return {
        ...state,
        updatedBlock: action.data,
      };
      break;
    }

    case ActionTypes.ADD_MESSAGE:
      return {
        ...state,
        messages: action.data,
      };
      break;

    case ActionTypes.ADD_NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.data],
      };
    case ActionTypes.PINNED_MESSAGE:
      return {
        ...state,
        pinnedMessage: [...state.pinnedMessage, action.data],
      };

    case ActionTypes.DELETE_MESSAGE:
      var msg = state.messages;
      const newMessages = msg.filter((val) => val.m_id !== action.data.m_id);
      return {
        ...state,
        messages: newMessages,
      };

    case ActionTypes.REMOVE_PINNED_MESSAGE:
      var copy = [...state.pinnedMessage];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, pinnedMessage: filteredCopy };
      break;

    // *** COMMENTS
    case ActionTypes.ADD_COMMENTS:
      return {
        ...state,
        comments: action.data,
      };
      break;

    case ActionTypes.ADD_NEW_COMMENTS:
      return {
        ...state,
        comments: [...state.comments, action.data],
      };
      break;

    // *** Comment like
    case ActionTypes.ADD_COMMENT_LIKE:
      return {
        ...state,
        like: [...state.like, action.data],
      };

    // *** Comment Heart
    case ActionTypes.ADD_COMMENT_HEART:
      return {
        ...state,
        heart: [...state.heart, action.data],
      };

    // *** Comment Idea
    case ActionTypes.ADD_COMMENT_IDEA:
      return {
        ...state,
        idea: [...state.idea, action.data],
      };

    // *** Comment Dislike
    case ActionTypes.ADD_COMMENT_DISLIKE:
      return {
        ...state,
        dislike: [...state.dislike, action.data],
      };

    // *** Comment Funny
    case ActionTypes.ADD_COMMENT_DISLIKE:
      return {
        ...state,
        funny: [...state.funny, action.data],
      };

    case ActionTypes.JOIN_BLOCK:
      return {
        ...state,
        join: [...state.join, action.data],
      };

    case ActionTypes.REMOVE_BLOCK:
      var copy = [...state.join];
      var filteredCopy = copy.filter((l) => l != action.data);
      return { ...state, join: filteredCopy };
      break;

    case ActionTypes.SELECT_BLOCK: {
      return {
        ...state,
        selectBlock: action.data,
      };
      break;
    }

    case ActionTypes.UNSELECT_BLOCK: {
      return {
        ...state,
        selectBlock: null,
      };
      break;
    }

    default:
      return state;
  }
};
